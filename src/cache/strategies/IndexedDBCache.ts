// IndexedDB缓存策略实现

import { CacheStorage } from '@/types/cache.ts'

export class IndexedDBCacheStorage implements CacheStorage {
  private dbName: string
  private storeName: string
  private version: number
  private db: IDBDatabase | null = null

  constructor(
    dbName: string = 'CacheDB',
    storeName: string = 'cache',
    version: number = 1
  ) {
    this.dbName = dbName
    this.storeName = storeName
    this.version = version
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('expiresAt', 'expiresAt', { unique: false })
        }
      }
    })
  }

  async get(key: string): Promise<string | null> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            // 检查是否过期
            if (result.expiresAt && Date.now() > result.expiresAt) {
              // 异步删除过期项
              this.delete(key).catch(console.warn)
              resolve(null)
            } else {
              resolve(result.value)
            }
          } else {
            resolve(null)
          }
        }
        
        request.onerror = () => {
          reject(new Error('Failed to get item from IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB get error:', error)
      return null
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      const item = {
        key,
        value,
        timestamp: Date.now(),
        size: new Blob([value]).size
      }

      return new Promise((resolve, reject) => {
        const request = store.put(item)
        
        request.onsuccess = () => {
          resolve()
        }
        
        request.onerror = () => {
          reject(new Error('Failed to set item in IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB set error:', error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key)
        
        request.onsuccess = () => {
          resolve()
        }
        
        request.onerror = () => {
          reject(new Error('Failed to delete item from IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB delete error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.clear()
        
        request.onsuccess = () => {
          resolve()
        }
        
        request.onerror = () => {
          reject(new Error('Failed to clear IndexedDB store'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB clear error:', error)
    }
  }

  async keys(): Promise<string[]> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.getAllKeys()
        
        request.onsuccess = () => {
          const keys = request.result as string[]
          resolve(keys)
        }
        
        request.onerror = () => {
          reject(new Error('Failed to get keys from IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB keys error:', error)
      return []
    }
  }

  async size(): Promise<number> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.getAll()
        
        request.onsuccess = () => {
          const items = request.result
          const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0)
          resolve(totalSize)
        }
        
        request.onerror = () => {
          reject(new Error('Failed to calculate size in IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB size calculation error:', error)
      return 0
    }
  }

  // IndexedDB特有的方法
  async getExpiredKeys(): Promise<string[]> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('expiresAt')
      
      return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.upperBound(Date.now()))
        
        request.onsuccess = () => {
          const items = request.result
          const expiredKeys = items.map(item => item.key)
          resolve(expiredKeys)
        }
        
        request.onerror = () => {
          reject(new Error('Failed to get expired keys from IndexedDB'))
        }
      })
    } catch (error) {
      console.warn('IndexedDB getExpiredKeys error:', error)
      return []
    }
  }

  async cleanupExpired(): Promise<number> {
    try {
      const expiredKeys = await this.getExpiredKeys()
      let deletedCount = 0

      for (const key of expiredKeys) {
        await this.delete(key)
        deletedCount++
      }

      return deletedCount
    } catch (error) {
      console.warn('IndexedDB cleanupExpired error:', error)
      return 0
    }
  }
}

