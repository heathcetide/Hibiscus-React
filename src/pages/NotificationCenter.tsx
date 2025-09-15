import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  MoreVertical,
  RefreshCw,
  Search,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/UI/Button'
import Card, { CardContent } from '@/components/UI/Card'
import Badge from '@/components/UI/Badge'
import { showAlert } from '@/utils/notification'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const NotificationCenter = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  
  const { isAuthenticated } = useAuthStore()
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification
  } = useNotificationStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  // 重置分页当过滤条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery, sortBy])

  // 过滤和搜索通知
  const filteredNotifications = (notifications || []).filter(notification => {
    // 状态过滤
    const statusMatch = (() => {
      switch (filter) {
        case 'unread':
          return !notification.read
        case 'read':
          return notification.read
        default:
          return true
      }
    })()

    // 搜索过滤
    const searchMatch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())

    return statusMatch && searchMatch
  })

  // 排序
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB
  })

  // 分页
  const totalPages = Math.ceil(sortedNotifications.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedNotifications = sortedNotifications.slice(startIndex, endIndex)

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    showAlert('所有通知已标记为已读', 'success')
  }

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setShowActions(null)
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    setShowActions(null)
    showAlert('通知已删除', 'success')
  }

  const getNotificationIcon = (type?: string, isRead?: boolean) => {
    const iconClass = `w-4 h-4 ${isRead ? 'text-muted-foreground' : 'text-primary-foreground'}`
    
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />
      case 'warning':
        return <AlertCircle className={iconClass} />
      case 'error':
        return <XCircle className={iconClass} />
      default:
        return <Info className={iconClass} />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-card">
            <CardContent className="text-center py-12 px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Bell className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">
                请先登录
              </h2>
              <p className="text-muted-foreground text-lg">
                登录后即可查看您的通知消息
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Bell className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  通知中心
                </h1>
                <p className="text-muted-foreground text-lg">
                  管理您的所有通知消息
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotifications()}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  全部已读
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">总通知</p>
                    <p className="text-2xl font-bold text-foreground">{notifications?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">未读</p>
                    <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-destructive-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">已读</p>
                    <p className="text-2xl font-bold text-foreground">{(notifications?.length || 0) - unreadCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="搜索通知..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">筛选：</span>
                  </div>
                  <div className="flex space-x-2">
                    {[
                      { key: 'all', label: '全部', count: notifications?.length || 0 },
                      { key: 'unread', label: '未读', count: unreadCount },
                      { key: 'read', label: '已读', count: (notifications?.length || 0) - unreadCount }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setFilter(item.key as any)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          filter === item.key
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {item.label} ({item.count})
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">排序：</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="newest">最新</option>
                    <option value="oldest">最旧</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {paginatedNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Bell className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {filter === 'all' ? '暂无通知' : 
                   filter === 'unread' ? '暂无未读通知' : '暂无已读通知'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {filter === 'all' ? '您还没有收到任何通知' : 
                   filter === 'unread' ? '所有通知都已阅读' : '没有已读的通知'}
                </p>
              </motion.div>
            ) : (
              paginatedNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className={`transition-all duration-300 border-0 shadow-lg ${
                      !notification.read 
                        ? 'bg-card border-l-4 border-l-primary' 
                        : 'bg-card'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-3">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  !notification.read 
                                    ? 'bg-primary' 
                                    : 'bg-muted'
                                }`}
                              >
                                {getNotificationIcon(notification.type, notification.read)}
                              </motion.div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className={`text-base font-semibold truncate ${
                                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <Badge className="text-xs bg-destructive text-destructive-foreground">
                                      未读
                                    </Badge>
                                  )}
                                  {notification.type && (
                                    <Badge variant="outline" className="text-xs">
                                      {notification.type}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {notification.content}
                                </p>
                                
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { 
                                      addSuffix: true, 
                                      locale: zhCN 
                                    }) : '未知时间'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowActions(
                                showActions === notification.id.toString() ? null : notification.id.toString()
                              )}
                              className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-accent transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </motion.button>
                            
                            {showActions === notification.id.toString() && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-1 w-40 bg-popover rounded-lg shadow-lg border z-10 overflow-hidden"
                              >
                                <div className="py-1">
                                  {!notification.read && (
                                    <button
                                      onClick={() => handleMarkAsRead(notification.id.toString())}
                                      className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                                    >
                                      <Check className="w-3 h-3 mr-2" />
                                      标记为已读
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(notification.id.toString())}
                                    className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    删除
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    显示 {startIndex + 1} - {Math.min(endIndex, sortedNotifications.length)} 条，共 {sortedNotifications.length} 条通知
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      上一页
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default NotificationCenter
