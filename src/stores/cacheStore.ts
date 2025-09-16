// 缓存状态管理

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { CacheManager } from '../cache/CacheManager'
import { CacheConfig, CacheStats, CacheEvent, CacheEventType, CacheStrategy } from '../types/cache'

interface CacheState {
  // 缓存管理器实例
  managers: Map<string, CacheManager>
  
  // 当前活跃的缓存
  activeCache: string | null
  
  // 缓存统计信息
  stats: Map<string, CacheStats>
  
  // 缓存事件历史
  events: CacheEvent[]
  
  // 配置信息
  configs: Map<string, CacheConfig>
  
  // 加载状态
  isLoading: boolean
  
  // 错误信息
  error: string | null
}

interface CacheActions {
  // 缓存管理器操作
  createManager: (name: string, config?: Partial<CacheConfig>) => CacheManager
  getManager: (name: string) => CacheManager | null
  removeManager: (name: string) => void
  setActiveCache: (name: string) => void
  
  // 缓存操作
  get: (key: string, cacheName?: string) => Promise<any>
  set: <T = any>(key: string, value: T, config?: Partial<CacheConfig>, cacheName?: string) => Promise<void>
  delete: (key: string, cacheName?: string) => Promise<boolean>
  clear: (cacheName?: string) => Promise<void>
  has: (key: string, cacheName?: string) => Promise<boolean>
  
  // 批量操作
  getMany: (keys: string[], cacheName?: string) => Promise<Record<string, any>>
  setMany: <T = any>(items: Record<string, T>, config?: Partial<CacheConfig>, cacheName?: string) => Promise<void>
  deleteMany: (keys: string[], cacheName?: string) => Promise<number>
  
  // 标签操作
  getByTag: (tag: string, cacheName?: string) => Promise<Record<string, any>>
  deleteByTag: (tag: string, cacheName?: string) => Promise<number>
  
  // 统计和监控
  getStats: (cacheName?: string) => Promise<CacheStats | null>
  getAllStats: () => Promise<Map<string, CacheStats>>
  getEvents: (limit?: number) => CacheEvent[]
  
  // 生命周期管理
  cleanup: (cacheName?: string) => Promise<void>
  cleanupAll: () => Promise<void>
  preload: (keys: string[], cacheName?: string) => Promise<void>
  
  // 配置管理
  updateConfig: (name: string, config: Partial<CacheConfig>) => void
  getConfig: (name: string) => CacheConfig | null
  
  // 状态管理
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // 事件管理
  addEvent: (event: CacheEvent) => void
  clearEvents: () => void
  
  // 初始化
  initialize: () => Promise<void>
  destroy: () => Promise<void>
}

type CacheStore = CacheState & CacheActions

export const useCacheStore = create<CacheStore>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    managers: new Map(),
    activeCache: null,
    stats: new Map(),
    events: [],
    configs: new Map(),
    isLoading: false,
    error: null,

    // 缓存管理器操作
    createManager: (name: string, config?: Partial<CacheConfig>) => {
      const { managers, configs } = get()
      
      if (managers.has(name)) {
        return managers.get(name)!
      }
      
      const manager = new CacheManager(config)
      const fullConfig = manager.getConfig()
      
      // 设置事件监听
      manager.on(CacheEventType.SET, (event) => {
        get().addEvent(event)
      })
      
      manager.on(CacheEventType.GET, (event) => {
        get().addEvent(event)
      })
      
      manager.on(CacheEventType.DELETE, (event) => {
        get().addEvent(event)
      })
      
      manager.on(CacheEventType.CLEAR, (event) => {
        get().addEvent(event)
      })
      
      manager.on(CacheEventType.EXPIRE, (event) => {
        get().addEvent(event)
      })
      
      manager.on(CacheEventType.EVICT, (event) => {
        get().addEvent(event)
      })
      
      set({
        managers: new Map(managers.set(name, manager)),
        configs: new Map(configs.set(name, fullConfig)),
        activeCache: get().activeCache || name
      })
      
      return manager
    },

    getManager: (name: string) => {
      const { managers } = get()
      return managers.get(name) || null
    },

    removeManager: (name: string) => {
      const { managers, configs, stats, activeCache } = get()
      
      managers.delete(name)
      configs.delete(name)
      stats.delete(name)
      
      set({
        managers: new Map(managers),
        configs: new Map(configs),
        stats: new Map(stats),
        activeCache: activeCache === name ? null : activeCache
      })
    },

    setActiveCache: (name: string) => {
      const { managers } = get()
      if (managers.has(name)) {
        set({ activeCache: name })
      }
    },

    // 缓存操作
    get: async (key: string, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.get(key)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    set: async <T = any>(key: string, value: T, config?: Partial<CacheConfig>, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        await manager.set(key, value, config)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    delete: async (key: string, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.delete(key)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    clear: async (cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        await manager.clear()
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    has: async (key: string, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        return await manager.has(key)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        return false
      }
    },

    // 批量操作
    getMany: async (keys: string[], cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.getMany(keys)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    setMany: async <T = any>(items: Record<string, T>, config?: Partial<CacheConfig>, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        await manager.setMany(items, config)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteMany: async (keys: string[], cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.deleteMany(keys)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    // 标签操作
    getByTag: async (tag: string, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.getByTag(tag)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteByTag: async (tag: string, cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        const result = await manager.deleteByTag(tag)
        return result
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    // 统计和监控
    getStats: async (cacheName?: string) => {
      const { getManager, activeCache, stats } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        return null
      }
      
      try {
        const managerStats = await manager.getStats()
        const newStats = new Map(stats.set(cacheName || activeCache || 'default', managerStats))
        set({ stats: newStats })
        return managerStats
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        return null
      }
    },

    getAllStats: async () => {
      const { managers, stats } = get()
      const newStats = new Map(stats)
      
      for (const [name, manager] of managers) {
        try {
          const managerStats = await manager.getStats()
          newStats.set(name, managerStats)
        } catch (error) {
          console.error(`Failed to get stats for cache ${name}:`, error)
        }
      }
      
      set({ stats: newStats })
      return newStats
    },

    getEvents: (limit?: number) => {
      const { events } = get()
      return limit ? events.slice(-limit) : events
    },

    // 生命周期管理
    cleanup: async (cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        await manager.cleanup()
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    cleanupAll: async () => {
      const { managers } = get()
      
      try {
        set({ isLoading: true, error: null })
        
        const promises = Array.from(managers.values()).map(manager => 
          manager.cleanup().catch(console.error)
        )
        
        await Promise.all(promises)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    preload: async (keys: string[], cacheName?: string) => {
      const { getManager, activeCache } = get()
      const manager = getManager(cacheName || activeCache || 'default')
      
      if (!manager) {
        throw new Error(`Cache manager not found: ${cacheName || activeCache || 'default'}`)
      }
      
      try {
        set({ isLoading: true, error: null })
        await manager.preload(keys)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    // 配置管理
    updateConfig: (name: string, config: Partial<CacheConfig>) => {
      const { managers, configs } = get()
      const manager = managers.get(name)
      
      if (manager) {
        manager.updateConfig(config)
        const newConfig = manager.getConfig()
        set({
          configs: new Map(configs.set(name, newConfig))
        })
      }
    },

    getConfig: (name: string) => {
      const { configs } = get()
      return configs.get(name) || null
    },

    // 状态管理
    setLoading: (loading: boolean) => {
      set({ isLoading: loading })
    },

    setError: (error: string | null) => {
      set({ error })
    },

    clearError: () => {
      set({ error: null })
    },

    // 事件管理
    addEvent: (event: CacheEvent) => {
      const { events } = get()
      const newEvents = [...events, event].slice(-1000) // 保留最近1000个事件
      set({ events: newEvents })
    },

    clearEvents: () => {
      set({ events: [] })
    },

    // 初始化
    initialize: async () => {
      try {
        set({ isLoading: true, error: null })
        
        // 创建默认缓存管理器
        const { createManager } = get()
        createManager('default', {
          strategy: CacheStrategy.MEMORY,
          maxSize: 10 * 1024 * 1024, // 10MB
          maxAge: 24 * 60 * 60 * 1000, // 24小时
        })
        
        // 创建持久化缓存管理器
        createManager('persistent', {
          strategy: CacheStrategy.LOCAL_STORAGE,
          maxSize: 5 * 1024 * 1024, // 5MB
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
          persist: true
        })
        
        // 创建会话缓存管理器
        createManager('session', {
          strategy: CacheStrategy.SESSION_STORAGE,
          maxSize: 2 * 1024 * 1024, // 2MB
          maxAge: 60 * 60 * 1000, // 1小时
        })
        
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    destroy: async () => {
      const { managers } = get()
      
      try {
        set({ isLoading: true, error: null })
        
        // 清理所有缓存
        for (const manager of managers.values()) {
          await manager.clear()
        }
        
        set({
          managers: new Map(),
          activeCache: null,
          stats: new Map(),
          events: [],
          configs: new Map(),
          isLoading: false,
          error: null
        })
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Unknown error' })
        throw error
      } finally {
        set({ isLoading: false })
      }
    }
  }))
)
