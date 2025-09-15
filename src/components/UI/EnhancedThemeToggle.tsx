import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/themeStore.ts'
import { cn } from '@/utils/cn.ts'
import { setCustomThemeColor } from '@/utils/themeAdapter.ts'
import { 
  Sun, 
  Moon, 
  Palette, 
  Check, 
  X,
  RotateCcw
} from 'lucide-react'

interface EnhancedThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const EnhancedThemeToggle = ({ 
  className = "",
  size = 'md'
}: EnhancedThemeToggleProps) => {
  const { theme, toggleMode, setColor, isDark } = useThemeStore()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState('#3b82f6')

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const predefinedColors = [
    { name: 'default', color: '#3b82f6', label: '默认' },
    { name: 'cherry', color: '#ef4444', label: '樱桃' },
    { name: 'ocean', color: '#06b6d4', label: '海洋' },
    { name: 'nature', color: '#10b981', label: '自然' },
    { name: 'fresh', color: '#84cc16', label: '清新' },
    { name: 'sunset', color: '#f59e0b', label: '日落' },
    { name: 'lavender', color: '#8b5cf6', label: '薰衣草' },
    { name: 'rose', color: '#f43f5e', label: '玫瑰' }
  ]

  const handleColorSelect = (colorName: string) => {
    setColor(colorName as any)
    setShowColorPicker(false)
  }

  const handleCustomColor = () => {
    // 应用自定义颜色
    setCustomThemeColor(customColor)
    setShowColorPicker(false)
  }

  const resetToDefault = () => {
    // 重置为默认颜色
    document.documentElement.style.removeProperty('--color-primary')
    document.documentElement.style.removeProperty('--color-primary-hover')
    document.documentElement.style.removeProperty('--color-primary-foreground')
    setColor('default')
    setShowColorPicker(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* 主题切换按钮 */}
        <motion.button
          onClick={toggleMode}
          className={cn(
            'relative flex items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
            sizeClasses[size],
            className
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`切换到${isDark ? '浅色' : '深色'}主题`}
        >
          <motion.div
            className={cn('relative', iconSizes[size])}
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* 太阳图标 */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: isDark ? 0 : 1 }}
              animate={{ opacity: isDark ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className={cn('text-yellow-500', iconSizes[size])} />
            </motion.div>

            {/* 月亮图标 */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: isDark ? 1 : 0 }}
              animate={{ opacity: isDark ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className={cn('text-blue-400', iconSizes[size])} />
            </motion.div>
          </motion.div>
        </motion.button>

        {/* 颜色选择按钮 */}
        <motion.button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={cn(
            'relative flex items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
            sizeClasses[size]
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="选择主题颜色"
        >
          <Palette className={cn('text-purple-500', iconSizes[size])} />
        </motion.button>
      </div>

      {/* 颜色选择面板 */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
          >
            <div className="space-y-4">
              {/* 标题 */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  选择主题颜色
                </h3>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* 预设颜色 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  预设颜色
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {predefinedColors.map((color) => (
                    <motion.button
                      key={color.name}
                      onClick={() => handleColorSelect(color.name)}
                      className={cn(
                        'relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105',
                        theme.color === color.name
                          ? 'border-gray-900 dark:border-white'
                          : 'border-gray-200 dark:border-gray-600'
                      )}
                      style={{ backgroundColor: color.color }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {theme.color === color.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white drop-shadow-lg" />
                        </motion.div>
                      )}
                      <div className="text-xs text-white font-medium drop-shadow-lg">
                        {color.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 自定义颜色 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  自定义颜色
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                  />
                  <motion.button
                    onClick={handleCustomColor}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    应用
                  </motion.button>
                </div>
              </div>

              {/* 重置按钮 */}
              <motion.button
                onClick={resetToDefault}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                重置为默认
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedThemeToggle
