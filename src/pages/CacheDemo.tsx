// 缓存演示页面

import React, { useState, useEffect } from 'react'
import { CacheProvider, CacheStats, CacheMonitor, CacheConfig } from '../components/Cache'
import { useCache, useCacheStats, useCacheMonitor } from '../hooks/useCache'
import { CacheFactory } from '../cache/utils/CacheFactory'
import { CACHE_PRESETS } from '../config/cache'
import { CacheStrategy, CachePriority } from '../types/cache'

export default function CacheDemo() {
  const [selectedCache, setSelectedCache] = useState('default')
  const [testKey, setTestKey] = useState('test-key')
  const [testValue, setTestValue] = useState('test-value')
  const [testTag, setTestTag] = useState('test-tag')
  const [cacheKeys, setCacheKeys] = useState<string[]>([])

  // 初始化缓存管理器
  useEffect(() => {
    // 创建不同类型的缓存管理器
    CacheFactory.createMemoryCache('memory')
    CacheFactory.createLocalStorageCache('localStorage')
    CacheFactory.createSessionStorageCache('sessionStorage')
    CacheFactory.createIndexedDBCache('indexedDB')
    CacheFactory.createHighPerformanceCache('highPerformance')
    CacheFactory.createPersistentCache('persistent')
    CacheFactory.createTemporaryCache('temporary')
  }, [])

  return (
    <CacheProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">缓存管理系统演示</h1>
            <p className="mt-2 text-gray-600">
              展示前端缓存策略的各种功能和性能特性
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：缓存操作面板 */}
            <div className="lg:col-span-1 space-y-6">
              <CacheOperationsPanel
                selectedCache={selectedCache}
                onCacheChange={setSelectedCache}
                testKey={testKey}
                onKeyChange={setTestKey}
                testValue={testValue}
                onValueChange={setTestValue}
                testTag={testTag}
                onTagChange={setTestTag}
                onKeysChange={setCacheKeys}
              />
            </div>

            {/* 右侧：统计和监控 */}
            <div className="lg:col-span-2 space-y-6">
              <CacheStats cacheName={selectedCache} />
              <CacheMonitor cacheName={selectedCache} />
              <CacheConfig cacheName={selectedCache} />
            </div>
          </div>

          {/* 缓存键列表 */}
          {cacheKeys.length > 0 && (
            <div className="mt-8">
              <CacheKeysList keys={cacheKeys} cacheName={selectedCache} />
            </div>
          )}
        </div>
      </div>
    </CacheProvider>
  )
}

// 缓存操作面板组件
function CacheOperationsPanel({
  selectedCache,
  onCacheChange,
  testKey,
  onKeyChange,
  testValue,
  onValueChange,
  testTag,
  onTagChange,
  onKeysChange
}: {
  selectedCache: string
  onCacheChange: (cache: string) => void
  testKey: string
  onKeyChange: (key: string) => void
  testValue: string
  onValueChange: (value: string) => void
  testTag: string
  onTagChange: (tag: string) => void
  onKeysChange: (keys: string[]) => void
}) {
  const { get, set, delete: deleteCache, clear, has, getByTag, deleteByTag } = useCache()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGet = async () => {
    try {
      setLoading(true)
      setError(null)
      const value = await get(testKey, selectedCache)
      setResult(value)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSet = async () => {
    try {
      setLoading(true)
      setError(null)
      await set(testKey, testValue, { tags: [testTag] }, selectedCache)
      setResult('Value set successfully')
      onKeysChange([...new Set([testKey, ...(await getCacheKeys(selectedCache))])])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      const deleted = await deleteCache(testKey, selectedCache)
      setResult(deleted ? 'Key deleted successfully' : 'Key not found')
      onKeysChange(await getCacheKeys(selectedCache))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    try {
      setLoading(true)
      setError(null)
      await clear(selectedCache)
      setResult('Cache cleared successfully')
      onKeysChange([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleGetByTag = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await getByTag(testTag, selectedCache)
      setResult(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteByTag = async () => {
    try {
      setLoading(true)
      setError(null)
      const deleted = await deleteByTag(testTag, selectedCache)
      setResult(`Deleted ${deleted} items with tag "${testTag}"`)
      onKeysChange(await getCacheKeys(selectedCache))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadKeys = async () => {
    try {
      const keys = await getCacheKeys(selectedCache)
      onKeysChange(keys)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">缓存操作</h2>

      {/* 缓存选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择缓存类型
        </label>
        <select
          value={selectedCache}
          onChange={(e) => onCacheChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default</option>
          <option value="memory">Memory</option>
          <option value="localStorage">Local Storage</option>
          <option value="sessionStorage">Session Storage</option>
          <option value="indexedDB">IndexedDB</option>
          <option value="highPerformance">High Performance</option>
          <option value="persistent">Persistent</option>
          <option value="temporary">Temporary</option>
        </select>
      </div>

      {/* 测试键 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          测试键
        </label>
        <input
          type="text"
          value={testKey}
          onChange={(e) => onKeyChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入缓存键"
        />
      </div>

      {/* 测试值 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          测试值
        </label>
        <textarea
          value={testValue}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="输入缓存值"
        />
      </div>

      {/* 测试标签 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          测试标签
        </label>
        <input
          type="text"
          value={testTag}
          onChange={(e) => onTagChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入标签"
        />
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleGet}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            获取
          </button>
          <button
            onClick={handleSet}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            设置
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            删除
          </button>
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            清空
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleGetByTag}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            按标签获取
          </button>
          <button
            onClick={handleDeleteByTag}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
          >
            按标签删除
          </button>
        </div>

        <button
          onClick={handleLoadKeys}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          加载所有键
        </button>
      </div>

      {/* 结果显示 */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <span className="text-sm text-gray-600">操作中...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="text-green-800 text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

// 缓存键列表组件
function CacheKeysList({ keys, cacheName }: { keys: string[]; cacheName: string }) {
  const { get, delete: deleteCache } = useCache()
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [keyValue, setKeyValue] = useState<any>(null)

  const handleViewKey = async (key: string) => {
    try {
      const value = await get(key, cacheName)
      setSelectedKey(key)
      setKeyValue(value)
    } catch (error) {
      console.error('Failed to get key value:', error)
    }
  }

  const handleDeleteKey = async (key: string) => {
    try {
      await deleteCache(key, cacheName)
      // 这里可以添加刷新键列表的逻辑
    } catch (error) {
      console.error('Failed to delete key:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">缓存键列表 ({keys.length})</h2>
      
      {keys.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          暂无缓存键
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="font-mono text-sm">{key}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewKey(key)}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  查看
                </button>
                <button
                  onClick={() => handleDeleteKey(key)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 键值查看模态框 */}
      {selectedKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">键值详情</h3>
              <button
                onClick={() => setSelectedKey(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  键
                </label>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {selectedKey}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  值
                </label>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(keyValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 辅助函数：获取缓存键
async function getCacheKeys(cacheName: string): Promise<string[]> {
  // 这里需要实现获取缓存键的逻辑
  // 由于我们的缓存管理器没有直接提供这个方法，这里返回空数组
  return []
}
