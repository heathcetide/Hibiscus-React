import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Info, 
  Component, 
  Settings,
  Layout,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Bell,
  Palette,
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '关于', href: '/about', icon: Info },
    { name: '组件', href: '/components', icon: Component },
    { name: '布局', href: '/layout-showcase', icon: Layout },
    { name: '优化', href: '/optimization-showcase', icon: Gauge },
    { name: '高级', href: '/advanced', icon: Settings },
    { name: '演示', href: '/demo', icon: Component },
    { name: '通知演示', href: '/notification-demo', icon: Bell },
    { name: '主题演示', href: '/theme-demo', icon: Palette },
    { name: '设置', href: '/settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`hidden lg:flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-neutral-200/50 dark:border-neutral-700/50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
        {navigation.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className={`group relative flex items-center rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800'
                } ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3'}`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`${isCollapsed ? 'w-7 h-7 mx-auto group-hover:scale-110 transition-transform duration-200' : 'w-7 h-7 mr-3'}`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeSidebarItem"
                    className="absolute right-0 w-1 h-8 bg-primary rounded-l-full"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </motion.aside>
  )
}

export default Sidebar
