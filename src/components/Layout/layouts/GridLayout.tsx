import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List, Star, Heart, Share2, Eye } from 'lucide-react'
import Header from '../Header'
import { GridLayoutProps } from '@/types/layout'
import { defaultGridItems, defaultGridCategories } from '@/data/layoutDefaults'

const GridLayout = ({ 
  children, 
  title = '网格展示',
  subtitle = '响应式网格布局，支持多种展示模式',
  items = defaultGridItems,
  categories = defaultGridCategories,
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  },
  className = ''
}: GridLayoutProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getGridColumns = () => {
    if (viewMode === 'list') return 'space-y-4'
    return `grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} xl:grid-cols-${columns.wide} gap-6`
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}>
      <Header
          logo={{
            text: 'WriteWiz',
            subtext: 'Professional Services',
            image: '/public/icon-192x192.svg',
            href: '/'
          }}
      />
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* 网格布局标题和搜索 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>
            
            {(showSearch || showFilters) && (
              <div className="flex items-center space-x-4">
                {/* 搜索框 */}
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="搜索项目..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                )}
                
                {/* 筛选按钮 */}
                {showFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>筛选</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* 分类筛选和视图模式 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* 分类筛选 */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name} ({category.count})
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 视图模式切换 */}
            {showViewToggle && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">视图模式:</span>
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300'}`}
                  >
                    <List className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* 网格内容 */}
          <motion.div
            layout
            className={getGridColumns()}
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  } ${item.featured ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'} overflow-hidden`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {item.featured && (
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          <span>精选</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-500"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white rounded-full text-gray-600 hover:text-green-500"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </span>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.views}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                        {item.tags}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        查看详情
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* 主内容区域 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GridLayout

