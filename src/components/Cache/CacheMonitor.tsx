// 缓存监控组件

import { useState } from 'react'
import { useCacheMonitor } from '@/hooks/useCache.ts'
import { CacheEvent, CacheEventType } from '@/types/cache.ts'

interface CacheMonitorProps {
  cacheName?: string
  showEvents?: boolean
  maxEvents?: number
}

export function CacheMonitor({ 
  cacheName, 
  showEvents = true, 
  maxEvents = 50 
}: CacheMonitorProps) {
  const {
    stats,
    events,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    updateStats,
    updateEvents
  } = useCacheMonitor(cacheName)

  const [selectedEventType, setSelectedEventType] = useState<CacheEventType | 'all'>('all')

  const filteredEvents = events.filter(event => 
    selectedEventType === 'all' || event.type === selectedEventType
  ).slice(-maxEvents)

  const eventTypeCounts = events.reduce((counts, event) => {
    counts[event.type] = (counts[event.type] || 0) + 1
    return counts
  }, {} as Record<CacheEventType, number>)

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cache Monitor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-4 py-2 rounded font-medium ${
                isMonitoring
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
            <button
              onClick={() => {
                updateStats()
                updateEvents()
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Status: {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}</span>
          <span>Cache: {cacheName || 'All'}</span>
          <span>Events: {events.length}</span>
        </div>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Real-time Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatBytes(stats.totalSize)}
              </div>
              <div className="text-sm text-gray-600">Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(stats.hitRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.evictionCount}</div>
              <div className="text-sm text-gray-600">Evictions</div>
            </div>
          </div>
        </div>
      )}

      {/* 事件类型统计 */}
      {showEvents && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <div
                key={type}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedEventType === type
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setSelectedEventType(type as CacheEventType)}
              >
                <div className="text-lg font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
            <div
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedEventType === 'all'
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
              onClick={() => setSelectedEventType('all')}
            >
              <div className="text-lg font-bold">{events.length}</div>
              <div className="text-sm text-gray-600">All Events</div>
            </div>
          </div>
        </div>
      )}

      {/* 事件列表 */}
      {showEvents && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Recent Events</h3>
            <div className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredEvents.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No events to display
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map((event, index) => (
                  <EventItem key={`${event.timestamp}-${index}`} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function EventItem({ event }: { event: CacheEvent }) {
  const getEventIcon = (type: CacheEventType) => {
    switch (type) {
      case CacheEventType.SET:
        return '📝'
      case CacheEventType.GET:
        return '🔍'
      case CacheEventType.DELETE:
        return '🗑️'
      case CacheEventType.CLEAR:
        return '🧹'
      case CacheEventType.EXPIRE:
        return '⏰'
      case CacheEventType.EVICT:
        return '💨'
      case CacheEventType.HIT:
        return '✅'
      case CacheEventType.MISS:
        return '❌'
      default:
        return '📋'
    }
  }

  const getEventColor = (type: CacheEventType) => {
    switch (type) {
      case CacheEventType.SET:
        return 'text-blue-600'
      case CacheEventType.GET:
        return 'text-green-600'
      case CacheEventType.DELETE:
        return 'text-red-600'
      case CacheEventType.CLEAR:
        return 'text-orange-600'
      case CacheEventType.EXPIRE:
        return 'text-yellow-600'
      case CacheEventType.EVICT:
        return 'text-purple-600'
      case CacheEventType.HIT:
        return 'text-green-600'
      case CacheEventType.MISS:
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
      <span className="text-lg">{getEventIcon(event.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`font-medium capitalize ${getEventColor(event.type)}`}>
            {event.type}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600 truncate">{event.key}</span>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(event.timestamp).toLocaleTimeString()}
        </div>
      </div>
      {event.value !== undefined && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {typeof event.value === 'string' 
            ? event.value.substring(0, 20) + (event.value.length > 20 ? '...' : '')
            : JSON.stringify(event.value).substring(0, 20) + '...'
          }
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
