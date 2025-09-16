// 缓存工具函数

import { CacheItem, CacheConfig, CacheStrategy, ExpirationStrategy, CachePriority } from '@/types/cache.ts'

// 缓存键生成器
export class CacheKeyGenerator {
  private static readonly SEPARATOR = ':'
  private static readonly VERSION_SEPARATOR = '@'

  static generate(
    namespace: string,
    key: string,
    version?: string,
    tags?: string[]
  ): string {
    const parts = [namespace, key]
    
    if (version) {
      parts.push(this.VERSION_SEPARATOR + version)
    }
    
    if (tags && tags.length > 0) {
      parts.push('tags', tags.sort().join(','))
    }
    
    return parts.join(this.SEPARATOR)
  }

  static parse(cacheKey: string): {
    namespace: string
    key: string
    version?: string
    tags?: string[]
  } {
    const parts = cacheKey.split(this.SEPARATOR)
    const namespace = parts[0]
    const key = parts[1]
    
    let version: string | undefined
    let tags: string[] | undefined
    
    for (let i = 2; i < parts.length; i++) {
      const part = parts[i]
      
      if (part.startsWith(this.VERSION_SEPARATOR)) {
        version = part.substring(1)
      } else if (part === 'tags' && i + 1 < parts.length) {
        tags = parts[i + 1].split(',')
        break
      }
    }
    
    return { namespace, key, version, tags }
  }

  static isValid(cacheKey: string): boolean {
    return cacheKey.includes(this.SEPARATOR) && cacheKey.length > 0
  }
}

// 缓存过期时间计算器
export class ExpirationCalculator {
  static calculate(
    maxAge: number,
    strategy: ExpirationStrategy,
    baseTime: number = Date.now()
  ): number {
    switch (strategy) {
      case ExpirationStrategy.ABSOLUTE:
        return baseTime + maxAge
      case ExpirationStrategy.RELATIVE:
        return baseTime + maxAge
      case ExpirationStrategy.SLIDING:
        return baseTime + maxAge
      case ExpirationStrategy.NEVER:
        return 0
      default:
        return baseTime + maxAge
    }
  }

  static isExpired(expiresAt: number): boolean {
    return expiresAt > 0 && Date.now() > expiresAt
  }

  static getTimeToExpiry(expiresAt: number): number {
    if (expiresAt === 0) return Infinity
    return Math.max(0, expiresAt - Date.now())
  }

  static formatTimeToExpiry(expiresAt: number): string {
    const timeToExpiry = this.getTimeToExpiry(expiresAt)
    
    if (timeToExpiry === Infinity) return 'Never'
    if (timeToExpiry === 0) return 'Expired'
    
    const seconds = Math.floor(timeToExpiry / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }
}

// 缓存大小计算器
export class SizeCalculator {
  static calculateItemSize<T>(item: CacheItem<T>): number {
    const baseSize = this.calculateStringSize(JSON.stringify(item.value))
    const metadataSize = this.calculateStringSize(JSON.stringify(item.metadata || {}))
    const tagsSize = item.tags.reduce((size, tag) => size + this.calculateStringSize(tag), 0)
    
    return baseSize + metadataSize + tagsSize + 200 // 200 bytes for overhead
  }

  static calculateStringSize(str: string): number {
    return new Blob([str]).size
  }

  static calculateObjectSize(obj: any): number {
    return this.calculateStringSize(JSON.stringify(obj))
  }

  static formatSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static parseSize(sizeStr: string): number {
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i)
    if (!match) return 0
    
    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()
    
    const multipliers: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    }
    
    return value * (multipliers[unit] || 1)
  }
}

// 缓存性能分析器
export class PerformanceAnalyzer {
  private static measurements: Map<string, number[]> = new Map()

  static startMeasurement(operation: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.measurements.has(operation)) {
        this.measurements.set(operation, [])
      }
      
      const measurements = this.measurements.get(operation)!
      measurements.push(duration)
      
      // 只保留最近100次测量
      if (measurements.length > 100) {
        measurements.shift()
      }
      
      return duration
    }
  }

  static getAverageTime(operation: string): number {
    const measurements = this.measurements.get(operation)
    if (!measurements || measurements.length === 0) return 0
    
    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length
  }

  static getMinTime(operation: string): number {
    const measurements = this.measurements.get(operation)
    if (!measurements || measurements.length === 0) return 0
    
    return Math.min(...measurements)
  }

  static getMaxTime(operation: string): number {
    const measurements = this.measurements.get(operation)
    if (!measurements || measurements.length === 0) return 0
    
    return Math.max(...measurements)
  }

  static getStats(operation: string): {
    average: number
    min: number
    max: number
    count: number
  } {
    const measurements = this.measurements.get(operation)
    if (!measurements || measurements.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 }
    }
    
    return {
      average: this.getAverageTime(operation),
      min: this.getMinTime(operation),
      max: this.getMaxTime(operation),
      count: measurements.length
    }
  }

  static clearMeasurements(operation?: string): void {
    if (operation) {
      this.measurements.delete(operation)
    } else {
      this.measurements.clear()
    }
  }
}

// 缓存配置验证器
export class ConfigValidator {
  static validate(config: Partial<CacheConfig>): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // 验证策略
    if (config.strategy && !Object.values(CacheStrategy).includes(config.strategy)) {
      errors.push(`Invalid cache strategy: ${config.strategy}`)
    }

    // 验证过期策略
    if (config.expirationStrategy && !Object.values(ExpirationStrategy).includes(config.expirationStrategy)) {
      errors.push(`Invalid expiration strategy: ${config.expirationStrategy}`)
    }

    // 验证优先级
    if (config.priority && !Object.values(CachePriority).includes(config.priority)) {
      errors.push(`Invalid cache priority: ${config.priority}`)
    }

    // 验证大小
    if (config.maxSize !== undefined && (config.maxSize < 0 || !Number.isInteger(config.maxSize))) {
      errors.push('Max size must be a positive integer')
    }

    // 验证年龄
    if (config.maxAge !== undefined && (config.maxAge < 0 || !Number.isInteger(config.maxAge))) {
      errors.push('Max age must be a positive integer')
    }

    // 验证命名空间
    if (config.namespace && (typeof config.namespace !== 'string' || config.namespace.trim().length === 0)) {
      errors.push('Namespace must be a non-empty string')
    }

    // 验证版本
    if (config.version && (typeof config.version !== 'string' || config.version.trim().length === 0)) {
      errors.push('Version must be a non-empty string')
    }

    // 验证标签
    if (config.tags && (!Array.isArray(config.tags) || !config.tags.every(tag => typeof tag === 'string'))) {
      errors.push('Tags must be an array of strings')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static sanitize(config: Partial<CacheConfig>): CacheConfig {
    return {
      strategy: config.strategy || CacheStrategy.MEMORY,
      maxSize: Math.max(0, config.maxSize || 10 * 1024 * 1024),
      maxAge: Math.max(0, config.maxAge || 24 * 60 * 60 * 1000),
      expirationStrategy: config.expirationStrategy || ExpirationStrategy.ABSOLUTE,
      priority: config.priority || CachePriority.NORMAL,
      tags: Array.isArray(config.tags) ? config.tags.filter(tag => typeof tag === 'string') : [],
      persist: Boolean(config.persist),
      compress: Boolean(config.compress),
      encrypt: Boolean(config.encrypt),
      version: config.version || '1.0.0',
      namespace: config.namespace || 'default'
    }
  }
}

// 缓存清理器
export class CacheCleaner {
  static async cleanExpired<T>(
    items: Map<string, CacheItem<T>>
  ): Promise<{ cleaned: number; remaining: number }> {
    let cleaned = 0
    const now = Date.now()
    
    for (const [key, item] of items) {
      if (item.expiresAt && item.expiresAt > 0 && now > item.expiresAt) {
        items.delete(key)
        cleaned++
      }
    }
    
    return { cleaned, remaining: items.size }
  }

  static async cleanBySize<T>(
    items: Map<string, CacheItem<T>>,
    maxSize: number
  ): Promise<{ cleaned: number; remaining: number }> {
    let cleaned = 0
    let currentSize = 0
    
    // 计算当前大小
    for (const item of items.values()) {
      currentSize += item.size
    }
    
    if (currentSize <= maxSize) {
      return { cleaned: 0, remaining: items.size }
    }
    
    // 按优先级和最后访问时间排序
    const sortedItems = Array.from(items.entries()).sort(([, a], [, b]) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority // 低优先级先删除
      }
      return a.lastAccessed - b.lastAccessed // 最久未访问的先删除
    })
    
    // 删除最不重要的项
    for (const [key, item] of sortedItems) {
      if (currentSize <= maxSize * 0.8) break // 清理到80%
      
      items.delete(key)
      currentSize -= item.size
      cleaned++
    }
    
    return { cleaned, remaining: items.size }
  }

  static async cleanByTag<T>(
    items: Map<string, CacheItem<T>>,
    tag: string
  ): Promise<{ cleaned: number; remaining: number }> {
    let cleaned = 0
    
    for (const [key, item] of items) {
      if (item.tags.includes(tag)) {
        items.delete(key)
        cleaned++
      }
    }
    
    return { cleaned, remaining: items.size }
  }
}

// 缓存序列化工具
export class SerializationUtils {
  static serialize<T>(value: T): string {
    try {
      return JSON.stringify(value)
    } catch (error) {
      throw new Error(`Serialization failed: ${error}`)
    }
  }

  static deserialize<T>(data: string): T {
    try {
      return JSON.parse(data)
    } catch (error) {
      throw new Error(`Deserialization failed: ${error}`)
    }
  }

  static isSerializable(value: any): boolean {
    try {
      JSON.stringify(value)
      return true
    } catch {
      return false
    }
  }

  static getSerializedSize<T>(value: T): number {
    return SizeCalculator.calculateStringSize(this.serialize(value))
  }
}

// 缓存键工具
export class KeyUtils {
  static sanitize(key: string): string {
    return key.replace(/[^a-zA-Z0-9:_-]/g, '_')
  }

  static isValid(key: string): boolean {
    return typeof key === 'string' && key.length > 0 && key.length <= 250
  }

  static generateHash(key: string): string {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  static matchesPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return regex.test(key)
  }
}
