import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, Layout } from 'lucide-react'
import Button from '../UI/Button'
import EnhancedThemeToggle from '../UI/EnhancedThemeToggle'
import { useAuthStore } from '@/stores/authStore.ts'
import { useUIStore } from '@/stores/uiStore'
import AuthModal from '../Auth/AuthModal'

interface HeaderProps {
  logo?: {
    text?: string
    subtext?: string
    icon?: string
    image?: string
    href?: string
  }
  navigation?: Array<{
    name: string
    href: string
    exact?: boolean
  }>
  showLayoutSwitcher?: boolean
  showThemeToggle?: boolean
  showUserMenu?: boolean
  className?: string
}

const Header = ({
  logo = {
    text: 'Hibiscus',
    subtext: 'AI Writing Assistant',
    icon: 'H',
    href: '/'
  },
  navigation = [
    { name: '首页', href: '/', exact: true },
    { name: '组件库', href: '/component-library' },
    { name: '仪表板', href: '/dashboard' },
    { name: '项目', href: '/projects' },
    { name: '小说写作', href: '/novel-writing' },
    { name: '小说组件', href: '/novel-showcase' },
    { name: '布局展示', href: '/layout-showcase' },
    { name: '高级组件', href: '/advanced-showcase' },
    { name: '动画展示', href: '/animation-showcase' },
  ],
  showLayoutSwitcher = true,
  showThemeToggle = true,
  showUserMenu = true,
  className = ''
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenuDropdown, setShowUserMenuDropdown] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()

  const { user, isAuthenticated, logout } = useAuthStore()
  const { layoutType, setLayoutType } = useUIStore()

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path) && path !== '/'
  }


  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3"
          >
            <Link to={logo.href || '/'} className="flex items-center space-x-3">
              {logo.image ? (
                <img
                  src={logo.image}
                  alt={logo.text}
                  className="w-8 h-8 rounded-lg shadow-md object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">{logo.icon}</span>
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                  {logo.text}
                </span>
                {logo.subtext && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none">
                    {logo.subtext}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.href, item.exact) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent rounded-md -z-10"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Layout Switcher Dropdown */}
            {showLayoutSwitcher && (
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  title="切换布局"
                >
                  <Layout className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {layoutType === 'sidebar' ? '侧边栏' :
                     layoutType === 'top-nav' ? '顶部导航' :
                     layoutType === 'grid' ? '网格' :
                     layoutType === 'card' ? '卡片' :
                     layoutType === 'minimal' ? '极简' :
                     layoutType === 'dashboard' ? '仪表板' :
                     layoutType === 'magazine' ? '杂志' :
                     layoutType === 'split' ? '分割' :
                     layoutType === 'masonry' ? '瀑布流' :
                     layoutType === 'kanban' ? '看板' :
                     layoutType === 'timeline' ? '时间线' :
                     layoutType === 'gallery' ? '画廊' :
                     layoutType === 'blog' ? '博客' :
                     layoutType === 'portfolio' ? '作品集' :
                     layoutType === 'ecommerce' ? '电商' :
                     layoutType === 'admin' ? '管理后台' :
                     layoutType === 'mobile-first' ? '移动优先' :
                     layoutType === 'fullscreen' ? '全屏' :
                     layoutType === 'floating' ? '浮动' : '布局'}
                  </span>
                </motion.button>

                {/* Layout Options Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-lg shadow-lg border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mb-2">快速切换</div>
                    {[
                      { type: 'sidebar', name: '侧边栏', icon: Layout },
                      { type: 'top-nav', name: '顶部导航', icon: Layout },
                      { type: 'grid', name: '网格', icon: Layout },
                      { type: 'card', name: '卡片', icon: Layout },
                      { type: 'minimal', name: '极简', icon: Layout },
                      { type: 'dashboard', name: '仪表板', icon: Layout },
                      { type: 'magazine', name: '杂志', icon: Layout },
                      { type: 'split', name: '分割', icon: Layout }
                    ].map((option) => (
                      <motion.button
                        key={option.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLayoutType(option.type as any)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          layoutType === option.type
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.name}</span>
                        {layoutType === option.type && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </motion.button>
                    ))}
                    <div className="border-t my-2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            {showThemeToggle && <EnhancedThemeToggle />}

            {/* User Menu or Auth Buttons */}
            {showUserMenu && (
              isAuthenticated ? (
                  <div className="relative">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setShowUserMenuDropdown(!showUserMenuDropdown)}
                        className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.displayName}&background=0ea5e9&color=fff`}
                          alt={user?.displayName}
                          className="w-8 h-8 rounded-full"
                      />
                      <span className="hidden sm:block text-xs font-medium">{user?.displayName}</span>
                    </motion.button>

                    {showUserMenuDropdown && (
                        <motion.div
                            initial={{opacity: 0, scale: 0.95, y: -10}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.95, y: -10}}
                            className="absolute right-0 top-full mt-2 w-48 bg-popover rounded-md shadow-md border z-50"
                        >
                          <div className="p-1">
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 px-3 py-2 rounded-sm hover:bg-accent transition-colors"
                                onClick={() => setShowUserMenuDropdown(false)}
                            >
                              <User className="w-4 h-4"/>
                              <span className="text-sm">个人资料</span>
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center space-x-3 px-3 py-2 rounded-sm hover:bg-accent transition-colors"
                                onClick={() => setShowUserMenuDropdown(false)}
                            >
                              <Settings className="w-4 h-4"/>
                              <span className="text-sm">设置</span>
                            </Link>
                            <hr className="my-1 border-border"/>
                            <button
                                onClick={() => {
                                  logout()
                                  setShowUserMenuDropdown(false)
                                }}
                                className="flex items-center space-x-3 px-3 py-2 rounded-sm hover:bg-destructive/10 text-destructive transition-colors w-full"
                            >
                              <LogOut className="w-4 h-4"/>
                              <span className="text-sm">退出登录</span>
                            </button>
                          </div>
                        </motion.div>
                    )}
                  </div>
              ) : (
                  <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowAuthModal(true)}
                  >
                    登录/注册
                  </Button>
              )
            )}

            {/* Mobile menu button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t"
            >
              <div className="py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href, item.exact)
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </motion.header>
  )
}

export default Header
