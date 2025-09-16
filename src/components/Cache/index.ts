// 缓存组件导出

export { CacheProvider, useCacheContext } from './CacheProvider'
export { CacheStats } from './CacheStats'
export { CacheMonitor } from './CacheMonitor'
export { CacheConfigComponent as CacheConfig } from './CacheConfig'

// 重新导出类型
export type {
  CacheStats as CacheStatsType,
  CacheEvent,
  CacheEventType,
  CacheStrategy,
  ExpirationStrategy,
  CachePriority,
  CacheItem,
  CacheManager as ICacheManager,
  CacheStorage,
  CacheSerializer,
  CacheCompressor,
  CacheEncryptor,
  CacheListener,
  CacheError,
  CacheErrorType,
  CacheOptions,
  CacheQuery,
  CacheResult,
  CacheWarmupConfig,
  CacheSyncConfig,
  CachePerformance,
  CacheStrategyConfig
} from '../../types/cache'
