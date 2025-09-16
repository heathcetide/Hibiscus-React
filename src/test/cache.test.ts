// 缓存系统测试

import { CacheManager } from '../cache/CacheManager'
import { CacheFactory } from '../cache/utils/CacheFactory'
import { CACHE_PRESETS } from '../config/cache'
import { CacheStrategy } from '../types/cache'

// 基础功能测试
async function testBasicOperations() {
  console.log('🧪 测试基础缓存操作...')
  
  const cache = new CacheManager({
    strategy: CacheStrategy.MEMORY,
    maxSize: 1024 * 1024, // 1MB
    maxAge: 60000 // 1分钟
  })

  // 测试设置和获取
  await cache.set('test-key', { name: 'Test', value: 123 })
  const result = await cache.get('test-key')
  
  if (result && result.name === 'Test' && result.value === 123) {
    console.log('✅ 基础设置和获取测试通过')
  } else {
    console.log('❌ 基础设置和获取测试失败')
  }

  // 测试删除
  const deleted = await cache.delete('test-key')
  const afterDelete = await cache.get('test-key')
  
  if (deleted && afterDelete === null) {
    console.log('✅ 删除操作测试通过')
  } else {
    console.log('❌ 删除操作测试失败')
  }

  // 测试清空
  await cache.set('key1', 'value1')
  await cache.set('key2', 'value2')
  await cache.clear()
  
  const key1 = await cache.get('key1')
  const key2 = await cache.get('key2')
  
  if (key1 === null && key2 === null) {
    console.log('✅ 清空操作测试通过')
  } else {
    console.log('❌ 清空操作测试失败')
  }
}

// 批量操作测试
async function testBatchOperations() {
  console.log('🧪 测试批量操作...')
  
  const cache = new CacheManager({
    strategy: CacheStrategy.MEMORY,
    maxSize: 1024 * 1024,
    maxAge: 60000
  })

  // 测试批量设置
  const items = {
    'batch-1': { id: 1, name: 'Item 1' },
    'batch-2': { id: 2, name: 'Item 2' },
    'batch-3': { id: 3, name: 'Item 3' }
  }
  
  await cache.setMany(items)
  
  // 测试批量获取
  const results = await cache.getMany(['batch-1', 'batch-2', 'batch-3'])
  
  if (results['batch-1'] && results['batch-2'] && results['batch-3']) {
    console.log('✅ 批量操作测试通过')
  } else {
    console.log('❌ 批量操作测试失败')
  }

  // 测试批量删除
  const deletedCount = await cache.deleteMany(['batch-1', 'batch-2'])
  
  if (deletedCount === 2) {
    console.log('✅ 批量删除测试通过')
  } else {
    console.log('❌ 批量删除测试失败')
  }
}

// 标签操作测试
async function testTagOperations() {
  console.log('🧪 测试标签操作...')
  
  const cache = new CacheManager({
    strategy: CacheStrategy.MEMORY,
    maxSize: 1024 * 1024,
    maxAge: 60000
  })

  // 设置带标签的缓存
  await cache.set('user:1', { name: 'Alice' }, { tags: ['users', 'admin'] })
  await cache.set('user:2', { name: 'Bob' }, { tags: ['users', 'member'] })
  await cache.set('product:1', { name: 'Product 1' }, { tags: ['products'] })

  // 按标签获取
  const users = await cache.getByTag('users')
  const products = await cache.getByTag('products')
  
  if (Object.keys(users).length === 2 && Object.keys(products).length === 1) {
    console.log('✅ 按标签获取测试通过')
  } else {
    console.log('❌ 按标签获取测试失败')
  }

  // 按标签删除
  const deletedCount = await cache.deleteByTag('users')
  
  if (deletedCount === 2) {
    console.log('✅ 按标签删除测试通过')
  } else {
    console.log('❌ 按标签删除测试失败')
  }
}

// 过期测试
async function testExpiration() {
  console.log('🧪 测试过期功能...')
  
  const cache = new CacheManager({
    strategy: CacheStrategy.MEMORY,
    maxSize: 1024 * 1024,
    maxAge: 100 // 100ms过期
  })

  // 设置短期过期的缓存
  await cache.set('expire-test', { data: 'will expire' })
  
  // 立即获取应该存在
  const immediate = await cache.get('expire-test')
  if (immediate) {
    console.log('✅ 立即获取测试通过')
  } else {
    console.log('❌ 立即获取测试失败')
  }

  // 等待过期
  await new Promise(resolve => setTimeout(resolve, 150))
  
  // 过期后获取应该为空
  const expired = await cache.get('expire-test')
  if (expired === null) {
    console.log('✅ 过期测试通过')
  } else {
    console.log('❌ 过期测试失败')
  }
}

// 统计信息测试
async function testStats() {
  console.log('🧪 测试统计信息...')
  
  const cache = new CacheManager({
    strategy: CacheStrategy.MEMORY,
    maxSize: 1024 * 1024,
    maxAge: 60000
  })

  // 执行一些操作
  await cache.set('stats-1', 'value1')
  await cache.set('stats-2', 'value2')
  await cache.get('stats-1') // 命中
  await cache.get('stats-3') // 未命中
  await cache.get('stats-1') // 命中

  const stats = await cache.getStats()
  
  if (stats.totalItems === 2 && stats.hitCount >= 2 && stats.missCount >= 1) {
    console.log('✅ 统计信息测试通过')
    console.log(`   总项目数: ${stats.totalItems}`)
    console.log(`   命中次数: ${stats.hitCount}`)
    console.log(`   未命中次数: ${stats.missCount}`)
    console.log(`   命中率: ${(stats.hitRate * 100).toFixed(1)}%`)
  } else {
    console.log('❌ 统计信息测试失败')
  }
}

// 工厂模式测试
async function testFactory() {
  console.log('🧪 测试工厂模式...')
  
  // 创建不同类型的缓存
  const memoryCache = CacheFactory.createMemoryCache('test-memory')
  const localStorageCache = CacheFactory.createLocalStorageCache('test-local')
  const sessionStorageCache = CacheFactory.createSessionStorageCache('test-session')

  // 测试内存缓存
  await memoryCache.set('memory-test', { type: 'memory' })
  const memoryResult = await memoryCache.get('memory-test')
  
  if (memoryResult && memoryResult.type === 'memory') {
    console.log('✅ 内存缓存工厂测试通过')
  } else {
    console.log('❌ 内存缓存工厂测试失败')
  }

  // 测试本地存储缓存
  await localStorageCache.set('local-test', { type: 'localStorage' })
  const localResult = await localStorageCache.get('local-test')
  
  if (localResult && localResult.type === 'localStorage') {
    console.log('✅ 本地存储缓存工厂测试通过')
  } else {
    console.log('❌ 本地存储缓存工厂测试失败')
  }

  // 测试会话存储缓存
  await sessionStorageCache.set('session-test', { type: 'sessionStorage' })
  const sessionResult = await sessionStorageCache.get('session-test')
  
  if (sessionResult && sessionResult.type === 'sessionStorage') {
    console.log('✅ 会话存储缓存工厂测试通过')
  } else {
    console.log('❌ 会话存储缓存工厂测试失败')
  }
}

// 预定义配置测试
async function testPresets() {
  console.log('🧪 测试预定义配置...')
  
  const cache = CacheFactory.createManager('preset-test', CACHE_PRESETS.HIGH_PERFORMANCE)
  
  await cache.set('preset-test', { performance: 'high' })
  const result = await cache.get('preset-test')
  
  if (result && result.performance === 'high') {
    console.log('✅ 预定义配置测试通过')
  } else {
    console.log('❌ 预定义配置测试失败')
  }
}

// 运行所有测试
export async function runCacheTests() {
  console.log('🚀 开始缓存系统测试...\n')
  
  try {
    await testBasicOperations()
    console.log('')
    
    await testBatchOperations()
    console.log('')
    
    await testTagOperations()
    console.log('')
    
    await testExpiration()
    console.log('')
    
    await testStats()
    console.log('')
    
    await testFactory()
    console.log('')
    
    await testPresets()
    console.log('')
    
    console.log('🎉 所有缓存系统测试完成！')
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

// 如果直接运行此文件，执行测试
if (typeof window === 'undefined') {
  runCacheTests()
}
