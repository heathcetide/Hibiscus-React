// 缓存统计组件

import React from 'react'
import { useCacheStats } from '@/hooks/useCache.ts'
import { CacheStats as CacheStatsType } from '../../types/cache'

interface CacheStatsProps {
  cacheName?: string
  showDetails?: boolean
  refreshInterval?: number
}

export function CacheStats({ 
  cacheName, 
  showDetails = true, 
  refreshInterval = 5000 
}: CacheStatsProps) {
  const { stats, loadStats, isLoading, error } = useCacheStats(cacheName)

  React.useEffect(() => {
    const interval = setInterval(loadStats, refreshInterval)
    return () => clearInterval(interval)
  }, [loadStats, refreshInterval])

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading cache stats...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-2">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Cache Stats Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-gray-500 text-center p-4">
        No cache stats available
      </div>
    )
  }

  const renderSingleStats = (stats: CacheStatsType) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
        <div className="text-sm text-gray-600">Total Items</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-green-600">
          {formatBytes(stats.totalSize)}
        </div>
        <div className="text-sm text-gray-600">Total Size</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-purple-600">
          {(stats.hitRate * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Hit Rate</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-orange-600">{stats.evictionCount}</div>
        <div className="text-sm text-gray-600">Evictions</div>
      </div>
    </div>
  )

  const renderMultipleStats = (statsMap: Map<string, CacheStatsType>) => (
    <div className="space-y-4">
      {Array.from(statsMap.entries()).map(([name, stats]) => (
        <div key={name} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3 capitalize">{name} Cache</h3>
          {renderSingleStats(stats)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Cache Statistics {cacheName && `- ${cacheName}`}
        </h2>
        <button
          onClick={loadStats}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {cacheName ? renderSingleStats(stats as CacheStatsType) : renderMultipleStats(stats as Map<string, CacheStatsType>)}

      {showDetails && cacheName && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Detailed Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Hit Count:</span>
              <span className="ml-2 font-medium">{(stats as CacheStatsType).hitCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Miss Count:</span>
              <span className="ml-2 font-medium">{(stats as CacheStatsType).missCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Memory Usage:</span>
              <span className="ml-2 font-medium">
                {((stats as CacheStatsType).memoryUsage).toFixed(2)}ms
              </span>
            </div>
            <div>
              <span className="text-gray-600">Storage Usage:</span>
              <span className="ml-2 font-medium">
                {((stats as CacheStatsType).storageUsage).toFixed(2)}ms
              </span>
            </div>
            <div>
              <span className="text-gray-600">Last Cleanup:</span>
              <span className="ml-2 font-medium">
                {formatDate((stats as CacheStatsType).lastCleanup)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}
