import { create } from 'zustand'
import { getNotifications } from '@/api/notification'

export interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'page' | 'component' | 'notification' | 'user' | 'content'
  url?: string
  icon?: string
  metadata?: Record<string, any>
}

interface SearchState {
  isOpen: boolean
  query: string
  results: SearchResult[]
  isLoading: boolean
  selectedIndex: number
  
  // Actions
  openSearch: () => void
  closeSearch: () => void
  setQuery: (query: string) => void
  setResults: (results: SearchResult[]) => void
  setLoading: (loading: boolean) => void
  setSelectedIndex: (index: number) => void
  selectNext: () => void
  selectPrevious: () => void
  selectResult: (index: number) => void
  clearSearch: () => void
}

// 模拟搜索结果数据
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '通知中心',
    description: '查看和管理所有通知消息',
    type: 'page',
    url: '/notifications',
    icon: 'Bell'
  },
  {
    id: '2',
    title: '个人资料',
    description: '管理您的个人信息和设置',
    type: 'page',
    url: '/profile',
    icon: 'User'
  },
  {
    id: '3',
    title: '组件库',
    description: '浏览所有可用的UI组件',
    type: 'page',
    url: '/component-library',
    icon: 'Layout'
  },
  {
    id: '4',
    title: '动画展示',
    description: '查看各种动画效果',
    type: 'page',
    url: '/animation-showcase',
    icon: 'Zap'
  },
  {
    id: '5',
    title: 'Button 组件',
    description: '可复用的按钮组件',
    type: 'component',
    url: '/component-library#button',
    icon: 'Square'
  },
  {
    id: '6',
    title: 'Card 组件',
    description: '卡片容器组件',
    type: 'component',
    url: '/component-library#card',
    icon: 'Square'
  },
  {
    id: '7',
    title: '系统通知',
    description: '数据库切换提醒',
    type: 'notification',
    url: '/notifications',
    icon: 'AlertCircle'
  },
  {
    id: '8',
    title: '欢迎消息',
    description: '欢迎使用 Hibiscus',
    type: 'notification',
    url: '/notifications',
    icon: 'Info'
  }
]

export const useSearchStore = create<SearchState>((set, get) => ({
  isOpen: false,
  query: '',
  results: [],
  isLoading: false,
  selectedIndex: 0,

  openSearch: () => {
    set({ isOpen: true, selectedIndex: 0 })
  },

  closeSearch: () => {
    set({ isOpen: false, query: '', results: [], selectedIndex: 0 })
  },

  setQuery: async (query: string) => {
    set({ query, selectedIndex: 0 })
    
    if (query.trim() === '') {
      set({ results: [] })
      return
    }

    set({ isLoading: true })
    
    try {
      // 搜索静态页面和组件
      const staticResults = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase())
      )

      // 搜索通知
      let notificationResults: SearchResult[] = []
      try {
        const notificationResponse = await getNotifications()
        if (notificationResponse.code === 200) {
          notificationResults = notificationResponse.data.list
            .filter((notification: any) =>
              notification.title.toLowerCase().includes(query.toLowerCase()) ||
              notification.content.toLowerCase().includes(query.toLowerCase())
            )
            .map((notification: any) => ({
              id: `notification-${notification.id}`,
              title: notification.title,
              description: notification.content,
              type: 'notification' as const,
              url: '/notifications',
              icon: 'Bell'
            }))
        }
      } catch (error) {
        console.warn('Failed to search notifications:', error)
      }

      const allResults = [...staticResults, ...notificationResults]
      
      set({ 
        results: allResults,
        isLoading: false,
        selectedIndex: 0
      })
    } catch (error) {
      console.error('Search error:', error)
      set({ 
        results: [],
        isLoading: false,
        selectedIndex: 0
      })
    }
  },

  setResults: (results: SearchResult[]) => {
    set({ results })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setSelectedIndex: (selectedIndex: number) => {
    set({ selectedIndex })
  },

  selectNext: () => {
    const { results, selectedIndex } = get()
    if (results.length > 0) {
      set({ selectedIndex: (selectedIndex + 1) % results.length })
    }
  },

  selectPrevious: () => {
    const { results, selectedIndex } = get()
    if (results.length > 0) {
      set({ selectedIndex: selectedIndex === 0 ? results.length - 1 : selectedIndex - 1 })
    }
  },

  selectResult: (index: number) => {
    const { results } = get()
    if (results[index]) {
      set({ selectedIndex: index })
    }
  },

  clearSearch: () => {
    set({ query: '', results: [], selectedIndex: 0 })
  }
}))
