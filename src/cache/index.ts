// 缓存系统主入口

// 导出核心类
export { CacheManager } from './CacheManager'

// 导出存储策略
export { MemoryCacheStorage } from './strategies/MemoryCache'
export { LocalStorageCacheStorage } from './strategies/LocalStorageCache'
export { SessionStorageCacheStorage } from './strategies/SessionStorageCache'
export { IndexedDBCacheStorage } from './strategies/IndexedDBCache'

// 导出工具类
export { SerializerFactory } from './utils/Serializers'
export { CompressorFactory } from './utils/Compressors'
export {
  CacheKeyGenerator,
  ExpirationCalculator,
  SizeCalculator,
  PerformanceAnalyzer,
  ConfigValidator,
  CacheCleaner,
  SerializationUtils,
  KeyUtils
} from './utils/CacheUtils'
export { CacheFactory } from './utils/CacheFactory'

// 导出状态管理
export { useCacheStore } from '../stores/cacheStore'

// 导出Hooks
export {
  useCache,
  useCacheState,
  useCacheStats,
  useCacheEvents,
  useCacheListener,
  useCacheCleanup,
  useCachePreload,
  useCacheConfig,
  useCacheManager,
  useCacheMonitor,
  useCachePerformance
} from '../hooks/useCache'

// 导出组件
export {
  CacheProvider,
  useCacheContext,
  CacheStats,
  CacheMonitor,
  CacheConfig
} from '../components/Cache'

// 导出配置
export {
  CACHE_PRESETS,
  CacheConfigManager,
  getCacheConfig,
  setCacheConfig,
  getCachePreset,
  createCacheConfig,
  validateCacheConfig,
  cacheConfigManager
} from '../config/cache'

// 导出类型
export type {
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
} from '../types/cache'
