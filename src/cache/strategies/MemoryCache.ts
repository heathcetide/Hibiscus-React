// 内存缓存策略实现

import { CacheStorage } from '@/types/cache.ts'

export class MemoryCacheStorage implements CacheStorage {
  private cache = new Map<string, string>()
  private maxSize: number
  private currentSize = 0

  constructor(maxSize: number = 50 * 1024 * 1024) { // 默认50MB
    this.maxSize = maxSize
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null
  }

  async set(key: string, value: string): Promise<void> {
    const valueSize = this.calculateSize(value)
    
    // 检查是否需要清理空间
    if (this.currentSize + valueSize > this.maxSize) {
      await this.evictSpace(valueSize)
    }

    this.cache.set(key, value)
    this.currentSize += valueSize
  }

  async delete(key: string): Promise<void> {
    const value = this.cache.get(key)
    if (value) {
      this.cache.delete(key)
      this.currentSize -= this.calculateSize(value)
    }
  }

  async clear(): Promise<void> {
    this.cache.clear()
    this.currentSize = 0
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys())
  }

  async size(): Promise<number> {
    return this.currentSize
  }

  private calculateSize(value: string): number {
    return new Blob([value]).size
  }

  private async evictSpace(requiredSize: number): Promise<void> {
    const keys = Array.from(this.cache.keys())
    let freedSize = 0

    // 简单的LRU策略：删除最旧的条目
    for (const key of keys) {
      if (freedSize >= requiredSize) break
      
      const value = this.cache.get(key)
      if (value) {
        this.cache.delete(key)
        freedSize += this.calculateSize(value)
      }
    }

    this.currentSize -= freedSize
  }
}

