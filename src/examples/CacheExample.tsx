// 缓存系统使用示例

import React, { useState, useEffect } from 'react'
import { CacheProvider, useCache, useCacheStats } from '../components/Cache'
import { CacheFactory } from '../cache/utils/CacheFactory'
import { CACHE_PRESETS } from '../config/cache'

// 示例组件：用户数据缓存
function UserDataExample() {
  const { get, set, delete: deleteCache } = useCache()
  const [userId, setUserId] = useState('123')
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async (id: string) => {
    setLoading(true)
    try {
      // 先尝试从缓存获取
      let user = await get(`user:${id}`)
      
      if (!user) {
        // 缓存未命中，模拟API调用
        console.log('Fetching user data from API...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        
        user = {
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          lastLogin: new Date().toISOString()
        }
        
        // 存储到缓存，设置1小时过期
        await set(`user:${id}`, user, { 
          maxAge: 60 * 60 * 1000, // 1小时
          tags: ['users', 'profiles']
        })
      } else {
        console.log('User data loaded from cache!')
      }
      
      setUserData(user)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearUserCache = async () => {
    await deleteCache(`user:${userId}`)
    setUserData(null)
  }

  useEffect(() => {
    if (userId) {
      fetchUserData(userId)
    }
  }, [userId])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">用户数据缓存示例</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          用户ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => fetchUserData(userId)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '加载中...' : '获取用户数据'}
        </button>
        <button
          onClick={clearUserCache}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          清除缓存
        </button>
      </div>

      {userData && (
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium mb-2">用户信息</h4>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {userData.id}</div>
            <div><strong>姓名:</strong> {userData.name}</div>
            <div><strong>邮箱:</strong> {userData.email}</div>
            <div><strong>最后登录:</strong> {new Date(userData.lastLogin).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// 示例组件：API数据缓存
function ApiDataExample() {
  const { get, set, getByTag, deleteByTag } = useCache()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      // 先尝试从缓存获取
      let cachedPosts = await getByTag('posts')
      
      if (Object.keys(cachedPosts).length === 0) {
        // 缓存未命中，模拟API调用
        console.log('Fetching posts from API...')
        await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟网络延迟
        
        const mockPosts = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `Post ${i + 1}`,
          content: `This is the content of post ${i + 1}`,
          author: `Author ${i + 1}`,
          createdAt: new Date().toISOString()
        }))
        
        // 批量存储到缓存
        const postsToCache: Record<string, any> = {}
        mockPosts.forEach(post => {
          postsToCache[`post:${post.id}`] = post
        })
        
        await set('posts:list', postsToCache, {
          maxAge: 30 * 60 * 1000, // 30分钟
          tags: ['posts', 'api-data']
        })
        
        setPosts(mockPosts)
      } else {
        console.log('Posts loaded from cache!')
        setPosts(Object.values(cachedPosts))
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearPostsCache = async () => {
    await deleteByTag('posts')
    setPosts([])
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">API数据缓存示例</h3>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '加载中...' : '获取文章列表'}
        </button>
        <button
          onClick={clearPostsCache}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          清除文章缓存
        </button>
      </div>

      {posts.length > 0 && (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="border border-gray-200 rounded-md p-3">
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{post.content}</p>
              <div className="text-xs text-gray-500 mt-2">
                作者: {post.author} | 创建时间: {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 示例组件：缓存统计
function CacheStatsExample() {
  const { stats, loadStats, isLoading } = useCacheStats()
  
  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">缓存统计</h3>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <span className="text-sm text-gray-600 mt-2">加载统计中...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">总项目数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(stats.totalSize / 1024).toFixed(1)}KB
            </div>
            <div className="text-sm text-gray-600">总大小</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.hitRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">命中率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.evictionCount}</div>
            <div className="text-sm text-gray-600">淘汰次数</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          暂无统计数据
        </div>
      )}
    </div>
  )
}

// 主示例组件
export default function CacheExample() {
  useEffect(() => {
    // 初始化不同类型的缓存
    CacheFactory.createMemoryCache('memory')
    CacheFactory.createLocalStorageCache('localStorage')
    CacheFactory.createSessionStorageCache('sessionStorage')
  }, [])

  return (
    <CacheProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">缓存系统使用示例</h1>
            <p className="mt-2 text-gray-600">
              展示缓存系统在实际应用中的使用方法和效果
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserDataExample />
            <ApiDataExample />
          </div>

          <div className="mt-8">
            <CacheStatsExample />
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
            <div className="text-blue-800 space-y-2">
              <p>• <strong>用户数据示例</strong>: 演示如何缓存用户信息，首次加载会模拟API调用，再次访问会从缓存获取</p>
              <p>• <strong>API数据示例</strong>: 展示批量数据的缓存和按标签管理</p>
              <p>• <strong>缓存统计</strong>: 实时显示缓存的性能指标</p>
              <p>• 尝试多次点击"获取"按钮，观察控制台输出，可以看到缓存命中的效果</p>
            </div>
          </div>
        </div>
      </div>
    </CacheProvider>
  )
}
