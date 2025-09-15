import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import Header from "@/components/Layout/Header.tsx";

interface SplitLayoutProps {
  children: ReactNode
}

const SplitLayout = ({ children }: SplitLayoutProps) => {
  const [leftWidth, setLeftWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const container = document.querySelector('.split-container')
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100
    const clampedWidth = Math.min(Math.max(newLeftWidth, 20), 80)
    setLeftWidth(clampedWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="split-container flex h-screen"
      >
        {/* 左侧面板 */}
        <div 
          className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-semibold mb-4">左侧面板</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">导航</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">左侧导航内容</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">工具</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">工具面板内容</p>
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div
          className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </div>

        {/* 右侧面板 */}
        <div 
          className="bg-white dark:bg-gray-900"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-semibold mb-4">主内容区域</h2>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SplitLayout
