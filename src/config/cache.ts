// 缓存配置系统

import { CacheConfig, CacheStrategy, ExpirationStrategy, CachePriority } from '../types/cache'
import { getEnvVar, getEnvBoolean, getEnvNumber } from '../utils/env'

// 默认缓存配置
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  strategy: CacheStrategy.MEMORY,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxAge: 24 * 60 * 60 * 1000, // 24小时
  expirationStrategy: ExpirationStrategy.ABSOLUTE,
  priority: CachePriority.NORMAL,
  tags: [],
  persist: false,
  compress: false,
  encrypt: false,
  version: '1.0.0',
  namespace: 'default'
}

// 预定义缓存配置
export const CACHE_PRESETS = {
  // 内存缓存
  MEMORY: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.MEMORY,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxAge: 60 * 60 * 1000, // 1小时
    persist: false
  },

  // 本地存储缓存
  LOCAL_STORAGE: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.LOCAL_STORAGE,
    maxSize: 5 * 1024 * 1024, // 5MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    persist: true
  },

  // 会话存储缓存
  SESSION_STORAGE: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.SESSION_STORAGE,
    maxSize: 2 * 1024 * 1024, // 2MB
    maxAge: 60 * 60 * 1000, // 1小时
    persist: false
  },

  // IndexedDB缓存
  INDEXED_DB: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.INDEXED_DB,
    maxSize: 50 * 1024 * 1024, // 50MB
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
    persist: true
  },

  // 高性能缓存
  HIGH_PERFORMANCE: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.MEMORY,
    maxSize: 50 * 1024 * 1024, // 50MB
    maxAge: 60 * 60 * 1000, // 1小时
    compress: true,
    priority: CachePriority.HIGH,
    persist: false
  },

  // 持久化缓存
  PERSISTENT: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.INDEXED_DB,
    maxSize: 100 * 1024 * 1024, // 100MB
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1年
    compress: true,
    encrypt: true,
    persist: true
  },

  // 临时缓存
  TEMPORARY: {
    ...DEFAULT_CACHE_CONFIG,
    strategy: CacheStrategy.SESSION_STORAGE,
    maxSize: 1 * 1024 * 1024, // 1MB
    maxAge: 10 * 60 * 1000, // 10分钟
    persist: false
  }
} as const

// 缓存配置管理器
export class CacheConfigManager {
  private static instance: CacheConfigManager
  private configs: Map<string, CacheConfig> = new Map()
  private globalConfig: Partial<CacheConfig> = {}

  private constructor() {
    this.loadGlobalConfig()
    this.initializeDefaultConfigs()
  }

  static getInstance(): CacheConfigManager {
    if (!CacheConfigManager.instance) {
      CacheConfigManager.instance = new CacheConfigManager()
    }
    return CacheConfigManager.instance
  }

  // 获取全局配置
  private loadGlobalConfig(): void {
    this.globalConfig = {
      strategy: getEnvVar('CACHE_STRATEGY') as CacheStrategy || DEFAULT_CACHE_CONFIG.strategy,
      maxSize: getEnvNumber('CACHE_MAX_SIZE') || DEFAULT_CACHE_CONFIG.maxSize,
      maxAge: getEnvNumber('CACHE_MAX_AGE') || DEFAULT_CACHE_CONFIG.maxAge,
      expirationStrategy: getEnvVar('CACHE_EXPIRATION_STRATEGY') as ExpirationStrategy || DEFAULT_CACHE_CONFIG.expirationStrategy,
      priority: getEnvNumber('CACHE_PRIORITY') as CachePriority || DEFAULT_CACHE_CONFIG.priority,
      persist: getEnvBoolean('CACHE_PERSIST') ?? DEFAULT_CACHE_CONFIG.persist,
      compress: getEnvBoolean('CACHE_COMPRESS') ?? DEFAULT_CACHE_CONFIG.compress,
      encrypt: getEnvBoolean('CACHE_ENCRYPT') ?? DEFAULT_CACHE_CONFIG.encrypt,
      version: getEnvVar('CACHE_VERSION') || DEFAULT_CACHE_CONFIG.version,
      namespace: getEnvVar('CACHE_NAMESPACE') || DEFAULT_CACHE_CONFIG.namespace
    }
  }

  // 初始化默认配置
  private initializeDefaultConfigs(): void {
    // 添加预定义配置
    Object.entries(CACHE_PRESETS).forEach(([name, config]) => {
      this.configs.set(name.toLowerCase(), config)
    })

    // 添加默认配置
    this.configs.set('default', { ...DEFAULT_CACHE_CONFIG, ...this.globalConfig })
  }

  // 获取配置
  getConfig(name: string): CacheConfig | null {
    return this.configs.get(name) || null
  }

  // 设置配置
  setConfig(name: string, config: Partial<CacheConfig>): void {
    const existingConfig = this.configs.get(name) || DEFAULT_CACHE_CONFIG
    const mergedConfig = { ...existingConfig, ...config }
    this.configs.set(name, mergedConfig)
  }

  // 获取所有配置
  getAllConfigs(): Map<string, CacheConfig> {
    return new Map(this.configs)
  }

  // 删除配置
  removeConfig(name: string): boolean {
    return this.configs.delete(name)
  }

  // 更新全局配置
  updateGlobalConfig(config: Partial<CacheConfig>): void {
    this.globalConfig = { ...this.globalConfig, ...config }
    
    // 更新所有配置
    for (const [name, existingConfig] of this.configs) {
      this.configs.set(name, { ...existingConfig, ...this.globalConfig })
    }
  }

  // 获取全局配置
  getGlobalConfig(): Partial<CacheConfig> {
    return { ...this.globalConfig }
  }

  // 重置配置
  resetConfig(name?: string): void {
    if (name) {
      this.configs.delete(name)
    } else {
      this.configs.clear()
      this.initializeDefaultConfigs()
    }
  }

  // 验证配置
  validateConfig(config: Partial<CacheConfig>): { isValid: boolean; errors: string[] } {
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

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // 合并配置
  mergeConfigs(base: CacheConfig, override: Partial<CacheConfig>): CacheConfig {
    return {
      ...base,
      ...override,
      tags: override.tags || base.tags
    }
  }

  // 导出配置
  exportConfig(name?: string): string {
    if (name) {
      const config = this.configs.get(name)
      return config ? JSON.stringify(config, null, 2) : ''
    }
    
    const allConfigs = Object.fromEntries(this.configs)
    return JSON.stringify(allConfigs, null, 2)
  }

  // 导入配置
  importConfig(configJson: string, name?: string): boolean {
    try {
      const configs = JSON.parse(configJson)
      
      if (name) {
        this.configs.set(name, configs)
      } else {
        Object.entries(configs).forEach(([configName, config]) => {
          this.configs.set(configName, config as CacheConfig)
        })
      }
      
      return true
    } catch (error) {
      console.error('Failed to import cache config:', error)
      return false
    }
  }
}

// 获取缓存配置
export function getCacheConfig(name: string = 'default'): CacheConfig {
  const manager = CacheConfigManager.getInstance()
  return manager.getConfig(name) || DEFAULT_CACHE_CONFIG
}

// 设置缓存配置
export function setCacheConfig(name: string, config: Partial<CacheConfig>): void {
  const manager = CacheConfigManager.getInstance()
  manager.setConfig(name, config)
}

// 获取预定义配置
export function getCachePreset(presetName: keyof typeof CACHE_PRESETS): CacheConfig {
  return CACHE_PRESETS[presetName]
}

// 创建自定义配置
export function createCacheConfig(overrides: Partial<CacheConfig>): CacheConfig {
  return { ...DEFAULT_CACHE_CONFIG, ...overrides }
}

// 缓存配置验证
export function validateCacheConfig(config: Partial<CacheConfig>): { isValid: boolean; errors: string[] } {
  const manager = CacheConfigManager.getInstance()
  return manager.validateConfig(config)
}

// 导出配置管理器实例
export const cacheConfigManager = CacheConfigManager.getInstance()
