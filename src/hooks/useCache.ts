// 缓存管理Hooks

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useCacheStore } from '../stores/cacheStore'
import { CacheConfig, CacheStats, CacheEvent, CacheEventType } from '../types/cache'

// 基础缓存Hook
export function useCache<T = any>(key: string, cacheName?: string) {
  const { get, set, delete: deleteCache, has, isLoading, error } = useCacheStore()
  const [value, setValue] = useState<T | null>(null)
  const [isLoadingLocal, setIsLoadingLocal] = useState(false)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  // 获取缓存值
  const getValue = useCallback(async () => {
    try {
      setIsLoadingLocal(true)
      setErrorLocal(null)
      const result = await get<T>(key, cacheName)
      setValue(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setErrorLocal(errorMessage)
      throw err
    } finally {
      setIsLoadingLocal(false)
    }
  }, [get, key, cacheName])

  // 设置缓存值
  const setValue = useCallback(async (newValue: T, config?: Partial<CacheConfig>) => {
    try {
      setIsLoadingLocal(true)
      setErrorLocal(null)
      await set(key, newValue, config, cacheName)
      setValue(newValue)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setErrorLocal(errorMessage)
      throw err
    } finally {
      setIsLoadingLocal(false)
    }
  }, [set, key, cacheName])

  // 删除缓存值
  const deleteValue = useCallback(async () => {
    try {
      setIsLoadingLocal(true)
      setErrorLocal(null)
      const result = await deleteCache(key, cacheName)
      if (result) {
        setValue(null)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setErrorLocal(errorMessage)
      throw err
    } finally {
      setIsLoadingLocal(false)
    }
  }, [deleteCache, key, cacheName])

  // 检查缓存是否存在
  const hasValue = useCallback(async () => {
    try {
      return await has(key, cacheName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setErrorLocal(errorMessage)
      return false
    }
  }, [has, key, cacheName])

  // 刷新缓存值
  const refresh = useCallback(() => {
    return getValue()
  }, [getValue])

  return {
    value,
    setValue,
    deleteValue,
    hasValue,
    refresh,
    isLoading: isLoading || isLoadingLocal,
    error: error || errorLocal,
    clearError: () => setErrorLocal(null)
  }
}

// 缓存状态Hook
export function useCacheState<T = any>(
  key: string,
  initialValue?: T,
  cacheName?: string
) {
  const { get, set, has } = useCacheStore()
  const [value, setValue] = useState<T | null>(initialValue || null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化时从缓存加载
  useEffect(() => {
    const loadFromCache = async () => {
      try {
        const cachedValue = await get<T>(key, cacheName)
        if (cachedValue !== null) {
          setValue(cachedValue)
        }
      } catch (error) {
        console.warn('Failed to load from cache:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadFromCache()
  }, [get, key, cacheName])

  // 设置值并同步到缓存
  const setValueAndCache = useCallback(async (newValue: T, config?: Partial<CacheConfig>) => {
    setValue(newValue)
    try {
      await set(key, newValue, config, cacheName)
    } catch (error) {
      console.warn('Failed to save to cache:', error)
    }
  }, [set, key, cacheName])

  return {
    value,
    setValue: setValueAndCache,
    isInitialized
  }
}

// 缓存统计Hook
export function useCacheStats(cacheName?: string) {
  const { getStats, getAllStats, isLoading, error } = useCacheStore()
  const [stats, setStats] = useState<CacheStats | Map<string, CacheStats> | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      setIsLoadingStats(true)
      if (cacheName) {
        const result = await getStats(cacheName)
        setStats(result)
      } else {
        const result = await getAllStats()
        setStats(result)
      }
    } catch (err) {
      console.error('Failed to load cache stats:', err)
    } finally {
      setIsLoadingStats(false)
    }
  }, [getStats, getAllStats, cacheName])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    loadStats,
    isLoading: isLoading || isLoadingStats,
    error
  }
}

// 缓存事件Hook
export function useCacheEvents(limit?: number) {
  const { getEvents, clearEvents } = useCacheStore()
  const [events, setEvents] = useState<CacheEvent[]>([])

  useEffect(() => {
    const events = getEvents(limit)
    setEvents(events)
  }, [getEvents, limit])

  const clearEventsList = useCallback(() => {
    clearEvents()
    setEvents([])
  }, [clearEvents])

  return {
    events,
    clearEvents: clearEventsList
  }
}

// 缓存监听Hook
export function useCacheListener(
  eventType: CacheEventType,
  callback: (event: CacheEvent) => void,
  cacheName?: string
) {
  const { getManager, activeCache } = useCacheStore()
  const callbackRef = useRef(callback)

  // 更新回调引用
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const manager = getManager(cacheName || activeCache || 'default')
    if (!manager) return

    const listener = (event: CacheEvent) => {
      callbackRef.current(event)
    }

    manager.on(eventType, listener)

    return () => {
      manager.off(eventType, listener)
    }
  }, [getManager, activeCache, cacheName, eventType])
}

// 缓存清理Hook
export function useCacheCleanup() {
  const { cleanup, cleanupAll, isLoading, error } = useCacheStore()
  const [isCleaning, setIsCleaning] = useState(false)

  const cleanCache = useCallback(async (cacheName?: string) => {
    try {
      setIsCleaning(true)
      if (cacheName) {
        await cleanup(cacheName)
      } else {
        await cleanupAll()
      }
    } catch (err) {
      console.error('Cache cleanup failed:', err)
      throw err
    } finally {
      setIsCleaning(false)
    }
  }, [cleanup, cleanupAll])

  return {
    cleanCache,
    isLoading: isLoading || isCleaning,
    error
  }
}

// 缓存预热Hook
export function useCachePreload() {
  const { preload, isLoading, error } = useCacheStore()
  const [isPreloading, setIsPreloading] = useState(false)

  const preloadCache = useCallback(async (keys: string[], cacheName?: string) => {
    try {
      setIsPreloading(true)
      await preload(keys, cacheName)
    } catch (err) {
      console.error('Cache preload failed:', err)
      throw err
    } finally {
      setIsPreloading(false)
    }
  }, [preload])

  return {
    preloadCache,
    isLoading: isLoading || isPreloading,
    error
  }
}

// 缓存配置Hook
export function useCacheConfig(cacheName: string) {
  const { getConfig, updateConfig } = useCacheStore()
  const [config, setConfig] = useState<CacheConfig | null>(null)

  useEffect(() => {
    const currentConfig = getConfig(cacheName)
    setConfig(currentConfig)
  }, [getConfig, cacheName])

  const updateCacheConfig = useCallback((newConfig: Partial<CacheConfig>) => {
    updateConfig(cacheName, newConfig)
    const updatedConfig = getConfig(cacheName)
    setConfig(updatedConfig)
  }, [updateConfig, getConfig, cacheName])

  return {
    config,
    updateConfig: updateCacheConfig
  }
}

// 缓存管理器Hook
export function useCacheManager(cacheName: string) {
  const { createManager, getManager, removeManager, setActiveCache } = useCacheStore()
  const [manager, setManager] = useState<any>(null)

  useEffect(() => {
    const currentManager = getManager(cacheName)
    setManager(currentManager)
  }, [getManager, cacheName])

  const createCacheManager = useCallback((config?: Partial<CacheConfig>) => {
    const newManager = createManager(cacheName, config)
    setManager(newManager)
    return newManager
  }, [createManager, cacheName])

  const removeCacheManager = useCallback(() => {
    removeManager(cacheName)
    setManager(null)
  }, [removeManager, cacheName])

  const setActiveCacheManager = useCallback(() => {
    setActiveCache(cacheName)
  }, [setActiveCache, cacheName])

  return {
    manager,
    createManager: createCacheManager,
    removeManager: removeCacheManager,
    setActive: setActiveCacheManager
  }
}

// 缓存状态监控Hook
export function useCacheMonitor(cacheName?: string) {
  const { getStats, getEvents } = useCacheStore()
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [events, setEvents] = useState<CacheEvent[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  const updateStats = useCallback(async () => {
    if (!isMonitoring) return
    
    try {
      const currentStats = await getStats(cacheName)
      setStats(currentStats)
    } catch (error) {
      console.error('Failed to update cache stats:', error)
    }
  }, [getStats, cacheName, isMonitoring])

  const updateEvents = useCallback(() => {
    if (!isMonitoring) return
    
    const currentEvents = getEvents(50) // 获取最近50个事件
    setEvents(currentEvents)
  }, [getEvents, isMonitoring])

  // 定期更新统计信息
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      updateStats()
      updateEvents()
    }, 1000) // 每秒更新一次

    return () => clearInterval(interval)
  }, [isMonitoring, updateStats, updateEvents])

  return {
    stats,
    events,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    updateStats,
    updateEvents
  }
}

// 缓存性能Hook
export function useCachePerformance(cacheName?: string) {
  const { getStats } = useCacheStore()
  const [performance, setPerformance] = useState({
    averageGetTime: 0,
    averageSetTime: 0,
    averageDeleteTime: 0,
    memoryEfficiency: 0,
    storageEfficiency: 0,
    compressionRatio: 0
  })

  const measurePerformance = useCallback(async () => {
    try {
      const stats = await getStats(cacheName)
      if (stats) {
        setPerformance({
          averageGetTime: stats.memoryUsage,
          averageSetTime: stats.storageUsage,
          averageDeleteTime: 0, // 需要从事件中计算
          memoryEfficiency: stats.hitRate,
          storageEfficiency: stats.totalSize / (10 * 1024 * 1024), // 相对于10MB的效率
          compressionRatio: 1.0 // 需要从压缩统计中获取
        })
      }
    } catch (error) {
      console.error('Failed to measure cache performance:', error)
    }
  }, [getStats, cacheName])

  useEffect(() => {
    measurePerformance()
  }, [measurePerformance])

  return {
    performance,
    measurePerformance
  }
}
