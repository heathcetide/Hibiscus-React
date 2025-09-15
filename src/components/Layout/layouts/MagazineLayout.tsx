import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from '../Header'

interface MagazineLayoutProps {
  children: ReactNode
}

const MagazineLayout = ({ children }: MagazineLayoutProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
          logo={{
            text: 'WriteWiz',
            subtext: 'Professional Services',
            image: '/public/icon-192x192.svg',
            href: '/'
          }}
      />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8"
        >
          {/* 主内容区域 - 占据大部分空间 */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none">
              {children}
            </div>
          </div>
          
          {/* 侧边栏区域 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">相关文章</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-sm">热门话题</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">探索最新趋势</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-sm">技术前沿</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">了解最新技术</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-sm">设计灵感</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">获取创意灵感</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">标签云</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'UI/UX', '设计', '开发', '创新'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MagazineLayout

