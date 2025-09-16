// 缓存配置组件

import React, { useState } from 'react'
import { useCacheConfig } from '../../hooks/useCache'
import { CacheConfig, CacheStrategy, ExpirationStrategy, CachePriority } from '../../types/cache'

interface CacheConfigProps {
  cacheName: string
  onConfigChange?: (config: CacheConfig) => void
}

export function CacheConfigComponent({ cacheName, onConfigChange }: CacheConfigProps) {
  const { config, updateConfig } = useCacheConfig(cacheName)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<CacheConfig>>({})

  React.useEffect(() => {
    if (config) {
      setFormData(config)
    }
  }, [config])

  const handleSave = () => {
    if (config) {
      updateConfig(formData)
      setIsEditing(false)
      onConfigChange?.(config)
    }
  }

  const handleCancel = () => {
    setFormData(config || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof CacheConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!config) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800">
          Cache configuration not found for "{cacheName}"
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Cache Configuration</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本配置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Configuration</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategy
            </label>
            {isEditing ? (
              <select
                value={formData.strategy || config.strategy}
                onChange={(e) => handleInputChange('strategy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(CacheStrategy).map(strategy => (
                  <option key={strategy} value={strategy}>
                    {strategy}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {config.strategy}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Size (bytes)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.maxSize || config.maxSize}
                onChange={(e) => handleInputChange('maxSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {formatBytes(config.maxSize)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Age (ms)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.maxAge || config.maxAge}
                onChange={(e) => handleInputChange('maxAge', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {formatDuration(config.maxAge)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Strategy
            </label>
            {isEditing ? (
              <select
                value={formData.expirationStrategy || config.expirationStrategy}
                onChange={(e) => handleInputChange('expirationStrategy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ExpirationStrategy).map(strategy => (
                  <option key={strategy} value={strategy}>
                    {strategy}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {config.expirationStrategy}
              </div>
            )}
          </div>
        </div>

        {/* 高级配置 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Configuration</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            {isEditing ? (
              <select
                value={formData.priority || config.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value) as CachePriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(CachePriority).map(priority => (
                  <option key={priority} value={priority}>
                    {getPriorityLabel(priority as CachePriority)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {getPriorityLabel(config.priority)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Namespace
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.namespace || config.namespace}
                onChange={(e) => handleInputChange('namespace', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {config.namespace}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.version || config.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md">
                {config.version}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Options</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.persist ?? config.persist}
                onChange={(e) => handleInputChange('persist', e.target.checked)}
                disabled={!isEditing}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Persist</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.compress ?? config.compress}
                onChange={(e) => handleInputChange('compress', e.target.checked)}
                disabled={!isEditing}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Compress</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.encrypt ?? config.encrypt}
                onChange={(e) => handleInputChange('encrypt', e.target.checked)}
                disabled={!isEditing}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Encrypt</span>
            </label>
          </div>
        </div>
      </div>

      {/* 标签配置 */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Tags</h3>
        {isEditing ? (
          <div>
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (config.tags || []).join(', ')}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(config.tags || []).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {tag}
              </span>
            ))}
            {(!config.tags || config.tags.length === 0) && (
              <span className="text-gray-500 text-sm">No tags</span>
            )}
          </div>
        )}
      </div>
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

function formatDuration(ms: number): string {
  if (ms === 0) return 'Never'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

function getPriorityLabel(priority: CachePriority): string {
  switch (priority) {
    case CachePriority.LOW:
      return 'Low'
    case CachePriority.NORMAL:
      return 'Normal'
    case CachePriority.HIGH:
      return 'High'
    case CachePriority.CRITICAL:
      return 'Critical'
    default:
      return 'Unknown'
  }
}
