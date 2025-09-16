// 缓存管理器实现

import {
  CacheManager as ICacheManager,
  CacheConfig,
  CacheItem,
  CacheStats,
  CacheEvent,
  CacheEventType,
  CacheListener,
  CacheSerializer,
  CacheStorage,
  CacheStrategy,
  ExpirationStrategy,
  CachePriority,
  CacheError,
  CacheErrorType
} from '../types/cache'

import { MemoryCacheStorage } from './strategies/MemoryCache'
import { LocalStorageCacheStorage } from './strategies/LocalStorageCache'
import { SessionStorageCacheStorage } from './strategies/SessionStorageCache'
import { IndexedDBCacheStorage } from './strategies/IndexedDBCache'
import { SerializerFactory } from './utils/Serializers'

export class CacheManager<T = any> implements ICacheManager<T> {
  private storage: CacheStorage
  private serializer: CacheSerializer<T>
  private config: CacheConfig
  private listeners: Map<CacheEventType, CacheListener<T>[]> = new Map()
  private stats: CacheStats
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = this.mergeConfig(config)
    this.storage = this.createStorage()
    this.serializer = this.createSerializer()
    this.stats = this.initializeStats()
    
    this.setupCleanupTimer()
    this.setupEventListeners()
  }

  // 基本操作
  async get(key: string): Promise<T | null> {
    try {
      const startTime = performance.now()
      const serialized = await this.storage.get(key)
      
      if (!serialized) {
        this.recordMiss()
        this.emitEvent(CacheEventType.MISS, key)
        return null
      }

      const item = await this.deserializeItem(serialized)
      
      // 检查是否过期
      if (this.isExpired(item)) {
        await this.delete(key)
        this.recordMiss()
        this.emitEvent(CacheEventType.EXPIRE, key)
        return null
      }

      // 更新访问统计
      item.accessCount++
      item.lastAccessed = Date.now()
      await this.storage.set(key, await this.serializeItem(item))

      this.recordHit()
      this.emitEvent(CacheEventType.HIT, key, item.value)
      
      const endTime = performance.now()
      this.updateStats('get', endTime - startTime)
      
      return item.value
    } catch (error) {
      this.handleError(error, key, 'get')
      return null
    }
  }

  async set(key: string, value: T, config?: Partial<CacheConfig>): Promise<void> {
    try {
      const startTime = performance.now()
      const itemConfig = { ...this.config, ...config }
      
      const item: CacheItem<T> = {
        key,
        value,
        timestamp: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
        size: this.calculateSize(value),
        priority: itemConfig.priority,
        tags: itemConfig.tags,
        metadata: {}
      }

      // 设置过期时间
      if (itemConfig.maxAge > 0) {
        item.expiresAt = this.calculateExpiration(itemConfig.maxAge, itemConfig.expirationStrategy)
      }

      await this.storage.set(key, await this.serializeItem(item))
      this.emitEvent(CacheEventType.SET, key, value)
      
      const endTime = performance.now()
      this.updateStats('set', endTime - startTime)
      
      // 检查是否需要清理
      await this.checkAndCleanup()
    } catch (error) {
      this.handleError(error, key, 'set')
      throw error
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const startTime = performance.now()
      const existed = await this.storage.get(key) !== null
      
      if (existed) {
        await this.storage.delete(key)
        this.emitEvent(CacheEventType.DELETE, key)
      }
      
      const endTime = performance.now()
      this.updateStats('delete', endTime - startTime)
      
      return existed
    } catch (error) {
      this.handleError(error, key, 'delete')
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      await this.storage.clear()
      this.stats = this.initializeStats()
      this.emitEvent(CacheEventType.CLEAR, '')
    } catch (error) {
      this.handleError(error, '', 'clear')
      throw error
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const serialized = await this.storage.get(key)
      if (!serialized) return false
      
      const item = await this.deserializeItem(serialized)
      return !this.isExpired(item)
    } catch (error) {
      this.handleError(error, key, 'has')
      return false
    }
  }

  // 批量操作
  async getMany(keys: string[]): Promise<Record<string, T | null>> {
    const results: Record<string, T | null> = {}
    
    // 并行获取所有键
    const promises = keys.map(async (key) => {
      const value = await this.get(key)
      return { key, value }
    })
    
    const resolved = await Promise.all(promises)
    
    for (const { key, value } of resolved) {
      results[key] = value
    }
    
    return results
  }

  async setMany(items: Record<string, T>, config?: Partial<CacheConfig>): Promise<void> {
    const promises = Object.entries(items).map(([key, value]) => 
      this.set(key, value, config)
    )
    
    await Promise.all(promises)
  }

  async deleteMany(keys: string[]): Promise<number> {
    const promises = keys.map(key => this.delete(key))
    const results = await Promise.all(promises)
    
    return results.filter(Boolean).length
  }

  // 标签操作
  async getByTag(tag: string): Promise<Record<string, T>> {
    try {
      const keys = await this.storage.keys()
      const results: Record<string, T> = {}
      
      for (const key of keys) {
        const serialized = await this.storage.get(key)
        if (serialized) {
          const item = await this.deserializeItem(serialized)
          if (item.tags.includes(tag) && !this.isExpired(item)) {
            results[key] = item.value
          }
        }
      }
      
      return results
    } catch (error) {
      this.handleError(error, tag, 'getByTag')
      return {}
    }
  }

  async deleteByTag(tag: string): Promise<number> {
    try {
      const keys = await this.storage.keys()
      let deletedCount = 0
      
      for (const key of keys) {
        const serialized = await this.storage.get(key)
        if (serialized) {
          const item = await this.deserializeItem(serialized)
          if (item.tags.includes(tag)) {
            await this.delete(key)
            deletedCount++
          }
        }
      }
      
      return deletedCount
    } catch (error) {
      this.handleError(error, tag, 'deleteByTag')
      return 0
    }
  }

  // 统计和监控
  async getStats(): Promise<CacheStats> {
    try {
      const keys = await this.storage.keys()
      const storageSize = await this.storage.size()
      
      this.stats.totalItems = keys.length
      this.stats.totalSize = storageSize
      this.stats.hitRate = this.calculateHitRate()
      
      return { ...this.stats }
    } catch (error) {
      this.handleError(error, '', 'getStats')
      return this.stats
    }
  }

  async getKeys(): Promise<string[]> {
    try {
      return await this.storage.keys()
    } catch (error) {
      this.handleError(error, '', 'getKeys')
      return []
    }
  }

  // 生命周期管理
  async cleanup(): Promise<void> {
    try {
      const keys = await this.storage.keys()
      let cleanedCount = 0
      
      for (const key of keys) {
        const serialized = await this.storage.get(key)
        if (serialized) {
          const item = await this.deserializeItem(serialized)
          if (this.isExpired(item)) {
            await this.delete(key)
            cleanedCount++
          }
        }
      }
      
      this.stats.evictionCount += cleanedCount
      this.stats.lastCleanup = Date.now()
      
      // 如果存储空间仍然不足，进行LRU清理
      await this.performLRUCleanup()
    } catch (error) {
      this.handleError(error, '', 'cleanup')
    }
  }

  async preload(keys: string[]): Promise<void> {
    const promises = keys.map(key => this.get(key))
    await Promise.all(promises)
  }

  // 事件监听
  on(event: CacheEventType, listener: CacheListener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  off(event: CacheEventType, listener: CacheListener<T>): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(listener)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  // 配置管理
  getConfig(): CacheConfig {
    return { ...this.config }
  }

  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config }
    
    // 如果存储策略改变，重新创建存储
    if (config.strategy && config.strategy !== this.config.strategy) {
      this.storage = this.createStorage()
    }
    
    // 重新设置清理定时器
    this.setupCleanupTimer()
  }

  // 私有方法
  private mergeConfig(config: Partial<CacheConfig>): CacheConfig {
    const defaultConfig: CacheConfig = {
      strategy: CacheStrategy.MEMORY,
      maxSize: 10 * 1024 * 1024, // 10MB
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      expirationStrategy: ExpirationStrategy.ABSOLUTE,
      priority: CachePriority.NORMAL,
      tags: [],
      persist: false,
      compress: false,
      encrypt: false,
      version: '1.0.0',
      namespace: 'default'
    }

    return { ...defaultConfig, ...config }
  }

  private createStorage(): CacheStorage {
    switch (this.config.strategy) {
      case CacheStrategy.MEMORY:
        return new MemoryCacheStorage(this.config.maxSize)
      case CacheStrategy.LOCAL_STORAGE:
        return new LocalStorageCacheStorage(`${this.config.namespace}_`, this.config.maxSize)
      case CacheStrategy.SESSION_STORAGE:
        return new SessionStorageCacheStorage(`${this.config.namespace}_`, this.config.maxSize)
      case CacheStrategy.INDEXED_DB:
        return new IndexedDBCacheStorage(`${this.config.namespace}_db`, 'cache', 1)
      default:
        return new MemoryCacheStorage(this.config.maxSize)
    }
  }

  private createSerializer(): CacheSerializer<T> {
    if (this.config.encrypt) {
      return SerializerFactory.createEncrypted('default-key', SerializerFactory.createJSON<T>())
    } else if (this.config.compress) {
      return SerializerFactory.createCompressed(SerializerFactory.createJSON<T>())
    } else {
      return SerializerFactory.createJSON<T>()
    }
  }

  private initializeStats(): CacheStats {
    return {
      totalItems: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      evictionCount: 0,
      lastCleanup: Date.now(),
      memoryUsage: 0,
      storageUsage: 0
    }
  }

  private setupCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    // 每5分钟清理一次过期项
    this.cleanupTimer = setInterval(() => {
      this.cleanup().catch(console.error)
    }, 5 * 60 * 1000)
  }

  private setupEventListeners(): void {
    // 监听页面卸载事件，清理资源
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.cleanupTimer) {
          clearInterval(this.cleanupTimer)
        }
      })
    }
  }

  private async serializeItem(item: CacheItem<T>): Promise<string> {
    const result = this.serializer.serialize(item as T)
    return result instanceof Promise ? await result : result
  }

  private async deserializeItem(serialized: string): Promise<CacheItem<T>> {
    const result = this.serializer.deserialize(serialized)
    const deserialized = result instanceof Promise ? await result : result
    return deserialized as CacheItem<T>
  }

  private calculateSize(value: T): number {
    return new Blob([JSON.stringify(value)]).size
  }

  private calculateExpiration(maxAge: number, strategy: ExpirationStrategy): number {
    const now = Date.now()
    
    switch (strategy) {
      case ExpirationStrategy.ABSOLUTE:
        return now + maxAge
      case ExpirationStrategy.RELATIVE:
        return now + maxAge
      case ExpirationStrategy.SLIDING:
        return now + maxAge
      case ExpirationStrategy.NEVER:
        return 0
      default:
        return now + maxAge
    }
  }

  private isExpired(item: CacheItem<T>): boolean {
    if (!item.expiresAt) return false
    return Date.now() > item.expiresAt
  }

  private recordHit(): void {
    this.stats.hitCount++
  }

  private recordMiss(): void {
    this.stats.missCount++
  }

  private calculateHitRate(): number {
    const total = this.stats.hitCount + this.stats.missCount
    return total > 0 ? this.stats.hitCount / total : 0
  }

  private updateStats(operation: string, duration: number): void {
    // 更新性能统计
    switch (operation) {
      case 'get':
        this.stats.memoryUsage = (this.stats.memoryUsage + duration) / 2
        break
      case 'set':
        this.stats.storageUsage = (this.stats.storageUsage + duration) / 2
        break
    }
  }

  private async checkAndCleanup(): Promise<void> {
    const currentSize = await this.storage.size()
    if (currentSize > this.config.maxSize * 0.9) {
      await this.performLRUCleanup()
    }
  }

  private async performLRUCleanup(): Promise<void> {
    try {
      const keys = await this.storage.keys()
      const items: Array<{ key: string; item: CacheItem<T> }> = []
      
      // 收集所有项的信息
      for (const key of keys) {
        const serialized = await this.storage.get(key)
        if (serialized) {
          const item = await this.deserializeItem(serialized)
          items.push({ key, item })
        }
      }
      
      // 按优先级和最后访问时间排序
      items.sort((a, b) => {
        if (a.item.priority !== b.item.priority) {
          return b.item.priority - a.item.priority
        }
        return a.item.lastAccessed - b.item.lastAccessed
      })
      
      // 删除最不重要的项
      const targetSize = this.config.maxSize * 0.8
      let currentSize = await this.storage.size()
      
      for (const { key } of items) {
        if (currentSize <= targetSize) break
        
        await this.delete(key)
        this.stats.evictionCount++
        this.emitEvent(CacheEventType.EVICT, key)
        
        currentSize = await this.storage.size()
      }
    } catch (error) {
      this.handleError(error, '', 'performLRUCleanup')
    }
  }

  private emitEvent(type: CacheEventType, key: string, value?: T): void {
    const event: CacheEvent<T> = {
      type,
      key,
      value,
      timestamp: Date.now()
    }
    
    const eventListeners = this.listeners.get(type)
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.error('Cache event listener error:', error)
        }
      })
    }
  }

  private handleError(error: any, key: string, operation: string): void {
    const cacheError: CacheError = {
      name: 'CacheError',
      message: `Cache ${operation} failed: ${error.message}`,
      type: this.getErrorType(error),
      key,
      code: error.code,
      details: error
    }
    
    console.error('Cache error:', cacheError)
  }

  private getErrorType(error: any): CacheErrorType {
    if (error.message?.includes('quota')) {
      return CacheErrorType.QUOTA_EXCEEDED
    } else if (error.message?.includes('serialization')) {
      return CacheErrorType.SERIALIZATION_ERROR
    } else if (error.message?.includes('deserialization')) {
      return CacheErrorType.DESERIALIZATION_ERROR
    } else {
      return CacheErrorType.NOT_FOUND
    }
  }
}
