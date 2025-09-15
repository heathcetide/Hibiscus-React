import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Heart, Star, Grid, List, SlidersHorizontal } from 'lucide-react'
import Header from '../Header'

interface EcommerceLayoutProps {
  children: ReactNode
}

const EcommerceLayout = ({ children }: EcommerceLayoutProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cartCount] = useState(3)

  const categories = [
    { id: 'all', name: '全部商品', count: 48 },
    { id: 'electronics', name: '电子产品', count: 12 },
    { id: 'clothing', name: '服装', count: 15 },
    { id: 'home', name: '家居', count: 10 },
    { id: 'books', name: '图书', count: 11 }
  ]

  const products = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    name: `商品 ${index + 1}`,
    description: `这是第 ${index + 1} 个商品的详细描述，具有优秀的品质和合理的价格。`,
    category: ['electronics', 'clothing', 'home', 'books'][index % 4],
    price: (Math.random() * 1000 + 10).toFixed(2),
    originalPrice: (Math.random() * 1200 + 15).toFixed(2),
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500),
    image: `https://picsum.photos/300/300?random=${index + 1}`,
    inStock: Math.random() > 0.1,
    isNew: index % 8 === 0,
    isSale: index % 6 === 0,
    discount: Math.floor(Math.random() * 30 + 10)
  }))

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
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
          {/* 电商标题和搜索 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold mb-2">在线商城</h1>
              <p className="text-gray-600 dark:text-gray-400">发现优质商品，享受购物乐趣</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 搜索框 */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* 购物车 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* 分类筛选和视图控制 */}
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

            {/* 视图模式和筛选 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">视图:</span>
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
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>筛选</span>
              </motion.button>
            </div>
          </div>

          {/* 商品网格 */}
          <motion.div
            layout
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }
          >
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'w-full h-48'} overflow-hidden`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    
                    {/* 标签 */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      {product.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                          新品
                        </span>
                      )}
                      {product.isSale && (
                        <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    
                    {/* 操作按钮 */}
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
                          <ShoppingCart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* 评分 */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(parseFloat(product.rating))
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                    
                    {/* 价格 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ¥{product.price}
                        </span>
                        {product.isSale && (
                          <span className="text-sm text-gray-500 line-through">
                            ¥{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        {categories.find(cat => cat.id === product.category)?.name}
                      </span>
                    </div>
                    
                    {/* 库存状态 */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        product.inStock 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {product.inStock ? '有库存' : '缺货'}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? '加入购物车' : '缺货'}
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

export default EcommerceLayout
