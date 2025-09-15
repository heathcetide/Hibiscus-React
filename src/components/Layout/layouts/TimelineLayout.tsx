import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag } from 'lucide-react'
import Header from '../Header'

interface TimelineLayoutProps {
  children: ReactNode
}

const TimelineLayout = ({ children }: TimelineLayoutProps) => {
  const timelineEvents = [
    {
      id: 1,
      title: '项目启动',
      description: '开始新的项目开发',
      date: '2024-01-15',
      time: '09:00',
      author: '张三',
      tags: ['项目', '启动'],
      type: 'milestone'
    },
    {
      id: 2,
      title: '需求分析完成',
      description: '完成了详细的需求分析文档',
      date: '2024-01-20',
      time: '14:30',
      author: '李四',
      tags: ['分析', '文档'],
      type: 'task'
    },
    {
      id: 3,
      title: 'UI设计稿',
      description: '完成了主要页面的UI设计',
      date: '2024-01-25',
      time: '16:45',
      author: '王五',
      tags: ['设计', 'UI'],
      type: 'design'
    },
    {
      id: 4,
      title: '开发环境搭建',
      description: '配置了开发环境和CI/CD流程',
      date: '2024-01-28',
      time: '11:20',
      author: '赵六',
      tags: ['开发', '环境'],
      type: 'development'
    },
    {
      id: 5,
      title: '核心功能开发',
      description: '实现了用户认证和主要业务逻辑',
      date: '2024-02-05',
      time: '15:10',
      author: '钱七',
      tags: ['开发', '功能'],
      type: 'development'
    }
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-blue-500'
      case 'task': return 'bg-green-500'
      case 'design': return 'bg-purple-500'
      case 'development': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

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
          className="space-y-8"
        >
          {/* 时间线标题 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">项目时间线</h1>
            <p className="text-gray-600 dark:text-gray-400">跟踪项目进展和重要里程碑</p>
          </div>

          {/* 时间线 */}
          <div className="relative">
            {/* 时间线轴线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  {/* 时间线节点 */}
                  <div className="relative z-10">
                    <div className={`w-4 h-4 rounded-full ${getEventColor(event.type)} border-4 border-white dark:border-gray-800 shadow-lg`}></div>
                  </div>

                  {/* 事件内容 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{event.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <div className="flex space-x-1">
                            {event.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
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

export default TimelineLayout
