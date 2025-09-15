import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MoreHorizontal } from 'lucide-react'
import Header from '../Header'

interface KanbanLayoutProps {
  children: ReactNode
}

const KanbanLayout = ({ children }: KanbanLayoutProps) => {
  const [columns] = useState([
    { id: 'todo', title: '待办', color: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'in-progress', title: '进行中', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'review', title: '审核', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'done', title: '完成', color: 'bg-green-100 dark:bg-green-900' }
  ])

  const [cards] = useState([
    { id: 1, title: '设计新界面', column: 'todo', priority: 'high' },
    { id: 2, title: '实现用户认证', column: 'in-progress', priority: 'medium' },
    { id: 3, title: '优化性能', column: 'review', priority: 'low' },
    { id: 4, title: '编写文档', column: 'done', priority: 'medium' },
    { id: 5, title: '测试功能', column: 'todo', priority: 'high' },
    { id: 6, title: '部署应用', column: 'in-progress', priority: 'high' }
  ])

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
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* 看板标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">项目看板</h1>
              <p className="text-gray-600 dark:text-gray-400">拖拽卡片来管理任务进度</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>添加任务</span>
            </motion.button>
          </div>

          {/* 看板列 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column, columnIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cards.filter(card => card.column === column.id).length}
                    </span>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {cards
                    .filter(card => card.column === column.id)
                    .map((card, cardIndex) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: cardIndex * 0.1 }}
                        className={`p-3 rounded-lg border-l-4 ${
                          card.priority === 'high' 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                            : card.priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-gray-500 bg-gray-50 dark:bg-gray-800'
                        } hover:shadow-md transition-shadow cursor-pointer`}
                      >
                        <h4 className="font-medium text-sm mb-1">{card.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            card.priority === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : card.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {card.priority === 'high' ? '高' : card.priority === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">添加卡片</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 主内容区域 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default KanbanLayout
