import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface DevErrorHandlerProps {
  onError?: (error: Error) => void
}

const DevErrorHandler = ({ onError }: DevErrorHandlerProps) => {
  useEffect(() => {
    // 处理未捕获的错误
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error)
      onError?.(event.error)
    }

    // 处理未处理的Promise拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      onError?.(new Error(event.reason))
    }

    // 处理资源加载错误
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'IMG') {
        console.warn('Image load error:', (target as HTMLImageElement).src)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleResourceError, true)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleResourceError, true)
    }
  }, [onError])

  // 开发环境下的连接状态指示器
  if (import.meta.env.MODE !== 'development') return null

  return (
    <motion.div
      className="fixed top-4 left-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-yellow-800 font-medium">开发模式</span>
      </div>
      <div className="text-yellow-700 mt-1">
        WebSocket连接问题已修复
      </div>
    </motion.div>
  )
}

export default DevErrorHandler
