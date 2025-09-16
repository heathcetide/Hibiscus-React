// 会话存储缓存策略实现

import { CacheStorage } from '@/types/cache.ts'

export class SessionStorageCacheStorage implements CacheStorage {
  private prefix: string
  private maxSize: number

  constructor(prefix: string = 'session_cache_', maxSize: number = 5 * 1024 * 1024) { // 默认5MB
    this.prefix = prefix
    this.maxSize = maxSize
  }

  async get(key: string): Promise<string | null> {
    try {
      const fullKey = this.getFullKey(key)
      const value = sessionStorage.getItem(fullKey)
      return value
    } catch (error) {
      console.warn('SessionStorage get error:', error)
      return null
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key)
      
      // 检查存储空间
      if (this.wouldExceedLimit(value)) {
        await this.cleanup()
      }

      sessionStorage.setItem(fullKey, value)
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // 存储空间不足，尝试清理
        await this.cleanup()
        try {
          sessionStorage.setItem(this.getFullKey(key), value)
        } catch (retryError) {
          throw new Error('Session storage quota exceeded')
        }
      } else {
        throw error
      }
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key)
      sessionStorage.removeItem(fullKey)
    } catch (error) {
      console.warn('SessionStorage delete error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(sessionStorage)
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix))
      
      cacheKeys.forEach(key => {
        sessionStorage.removeItem(key)
      })
    } catch (error) {
      console.warn('SessionStorage clear error:', error)
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys = Object.keys(sessionStorage)
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length))
    } catch (error) {
      console.warn('SessionStorage keys error:', error)
      return []
    }
  }

  async size(): Promise<number> {
    try {
      const keys = await this.keys()
      let totalSize = 0

      for (const key of keys) {
        const value = sessionStorage.getItem(this.getFullKey(key))
        if (value) {
          totalSize += new Blob([value]).size
        }
      }

      return totalSize
    } catch (error) {
      console.warn('SessionStorage size calculation error:', error)
      return 0
    }
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private wouldExceedLimit(value: string): boolean {
    const currentSize = this.getCurrentStorageSize()
    const valueSize = new Blob([value]).size
    return currentSize + valueSize > this.maxSize
  }

  private getCurrentStorageSize(): number {
    try {
      let totalSize = 0
      for (const key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
          const value = sessionStorage.getItem(key)
          if (value) {
            totalSize += new Blob([value]).size
          }
        }
      }
      return totalSize
    } catch (error) {
      return 0
    }
  }

  private async cleanup(): Promise<void> {
    try {
      const keys = await this.keys()
      const items: Array<{ key: string; size: number; timestamp: number }> = []

      // 收集所有缓存项的信息
      for (const key of keys) {
        const value = sessionStorage.getItem(this.getFullKey(key))
        if (value) {
          const size = new Blob([value]).size
          const timestamp = this.extractTimestamp(value)
          items.push({ key, size, timestamp })
        }
      }

      // 按时间戳排序（最旧的在前）
      items.sort((a, b) => a.timestamp - b.timestamp)

      // 删除最旧的项直到有足够空间
      const targetSize = this.maxSize * 0.8 // 清理到80%
      let currentSize = this.getCurrentStorageSize()

      for (const item of items) {
        if (currentSize <= targetSize) break
        
        sessionStorage.removeItem(this.getFullKey(item.key))
        currentSize -= item.size
      }
    } catch (error) {
      console.warn('SessionStorage cleanup error:', error)
    }
  }

  private extractTimestamp(value: string): number {
    try {
      const parsed = JSON.parse(value)
      return parsed.timestamp || Date.now()
    } catch {
      return Date.now()
    }
  }
}

