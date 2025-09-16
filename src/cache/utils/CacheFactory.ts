// 缓存工厂

import { CacheManager } from '@/cache'
import { CacheConfig, CacheStrategy } from '@/types/cache.ts'
import { ConfigValidator } from '@/cache'

export class CacheFactory {
  private static instances: Map<string, CacheManager> = new Map()

  // 创建缓存管理器
  static createManager(name: string, config?: Partial<CacheConfig>): CacheManager {
    if (this.instances.has(name)) {
      return this.instances.get(name)!
    }

    const validatedConfig = ConfigValidator.sanitize(config || {})
    const manager = new CacheManager(validatedConfig)
    
    this.instances.set(name, manager)
    return manager
  }

  // 获取缓存管理器
  static getManager(name: string): CacheManager | null {
    return this.instances.get(name) || null
  }

  // 移除缓存管理器
  static removeManager(name: string): boolean {
    return this.instances.delete(name)
  }

  // 获取所有管理器
  static getAllManagers(): Map<string, CacheManager> {
    return new Map(this.instances)
  }

  // 创建预定义配置的缓存管理器
  static createMemoryCache(name: string, maxSize?: number): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.MEMORY,
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      persist: false
    })
  }

  static createLocalStorageCache(name: string, maxSize?: number): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.LOCAL_STORAGE,
      maxSize: maxSize || 5 * 1024 * 1024, // 5MB
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      persist: true
    })
  }

  static createSessionStorageCache(name: string, maxSize?: number): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.SESSION_STORAGE,
      maxSize: maxSize || 2 * 1024 * 1024, // 2MB
      maxAge: 60 * 60 * 1000, // 1小时
      persist: false
    })
  }

  static createIndexedDBCache(name: string, maxSize?: number): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.INDEXED_DB,
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
      persist: true
    })
  }

  // 创建高性能缓存
  static createHighPerformanceCache(name: string): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.MEMORY,
      maxSize: 50 * 1024 * 1024, // 50MB
      maxAge: 60 * 60 * 1000, // 1小时
      compress: true,
      priority: 1, // HIGH
      persist: false
    })
  }

  // 创建持久化缓存
  static createPersistentCache(name: string): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.INDEXED_DB,
      maxSize: 100 * 1024 * 1024, // 100MB
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1年
      compress: true,
      encrypt: true,
      persist: true
    })
  }

  // 创建临时缓存
  static createTemporaryCache(name: string): CacheManager {
    return this.createManager(name, {
      strategy: CacheStrategy.SESSION_STORAGE,
      maxSize: 1 * 1024 * 1024, // 1MB
      maxAge: 10 * 60 * 1000, // 10分钟
      persist: false
    })
  }

  // 清理所有管理器
  static async cleanupAll(): Promise<void> {
    const promises = Array.from(this.instances.values()).map(manager => 
      manager.clear().catch(console.error)
    )
    await Promise.all(promises)
    this.instances.clear()
  }

  // 获取工厂统计信息
  static getStats(): {
    totalManagers: number
    managerNames: string[]
    totalMemoryUsage: number
  } {
    const managerNames = Array.from(this.instances.keys())
    let totalMemoryUsage = 0

    for (const _manager of this.instances.values()) {
      // 这里可以添加获取内存使用量的逻辑
      totalMemoryUsage += 0 // 暂时设为0，实际实现需要从manager获取
    }

    return {
      totalManagers: this.instances.size,
      managerNames,
      totalMemoryUsage
    }
  }
}
