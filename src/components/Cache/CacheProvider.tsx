// 缓存提供者组件

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useCacheStore } from '../../stores/cacheStore'
import { CacheConfig } from '../../types/cache'

interface CacheContextType {
  // 缓存操作
  get: <T = any>(key: string, cacheName?: string) => Promise<T | null>
  set: <T = any>(key: string, value: T, config?: Partial<CacheConfig>, cacheName?: string) => Promise<void>
  delete: (key: string, cacheName?: string) => Promise<boolean>
  clear: (cacheName?: string) => Promise<void>
  has: (key: string, cacheName?: string) => Promise<boolean>
  
  // 批量操作
  getMany: <T = any>(keys: string[], cacheName?: string) => Promise<Record<string, T | null>>
  setMany: <T = any>(items: Record<string, T>, config?: Partial<CacheConfig>, cacheName?: string) => Promise<void>
  deleteMany: (keys: string[], cacheName?: string) => Promise<number>
  
  // 标签操作
  getByTag: <T = any>(tag: string, cacheName?: string) => Promise<Record<string, T>>
  deleteByTag: (tag: string, cacheName?: string) => Promise<number>
  
  // 状态
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const CacheContext = createContext<CacheContextType | null>(null)

interface CacheProviderProps {
  children: ReactNode
  defaultConfig?: Partial<CacheConfig>
  autoInitialize?: boolean
}

export function CacheProvider({ 
  children, 
  defaultConfig,
  autoInitialize = true 
}: CacheProviderProps) {
  const {
    get,
    set,
    delete: deleteCache,
    clear,
    has,
    getMany,
    setMany,
    deleteMany,
    getByTag,
    deleteByTag,
    isLoading,
    error,
    clearError,
    initialize,
    createManager
  } = useCacheStore()

  useEffect(() => {
    if (autoInitialize) {
      initialize().catch(console.error)
    }
  }, [autoInitialize, initialize])

  useEffect(() => {
    if (defaultConfig) {
      createManager('default', defaultConfig)
    }
  }, [defaultConfig, createManager])

  const contextValue: CacheContextType = {
    get,
    set,
    delete: deleteCache,
    clear,
    has,
    getMany,
    setMany,
    deleteMany,
    getByTag,
    deleteByTag,
    isLoading,
    error,
    clearError
  }

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCacheContext(): CacheContextType {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCacheContext must be used within a CacheProvider')
  }
  return context
}
