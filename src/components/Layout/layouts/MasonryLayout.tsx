import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from '../Header'

interface MasonryLayoutProps {
  children: ReactNode
}

const MasonryLayout = ({ children }: MasonryLayoutProps) => {
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
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid mb-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">卡片 {index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">标题 {index + 1}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  这是瀑布流布局的卡片内容。每个卡片都有不同的高度，创造出自然的瀑布流效果。
                </p>
              </div>
            </motion.div>
          ))}
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default MasonryLayout
