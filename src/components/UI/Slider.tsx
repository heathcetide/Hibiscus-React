import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

interface SliderProps {
  value?: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  label?: string
  showValue?: boolean
  marks?: Array<{ value: number; label: string }>
}

const Slider = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  label,
  showValue = true,
  marks = []
}: SliderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return
    updateValue(e)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newValue = min + (percentage / 100) * (max - min)
    const steppedValue = Math.round(newValue / step) * step

    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {value}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <div
          ref={sliderRef}
          className={cn(
            'relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onMouseDown={handleMouseDown}
        >
          {/* 进度条 */}
          <div
            className="absolute h-2 bg-primary rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />

          {/* 滑块 */}
          <div
            className={cn(
              'absolute top-1/2 w-4 h-4 bg-white dark:bg-neutral-800 border-2 border-primary rounded-full transform -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all hover:scale-110',
              disabled && 'cursor-not-allowed'
            )}
            style={{ left: `calc(${percentage}% - 8px)` }}
          />

          {/* 标记 */}
          {marks.map((mark) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100
            return (
              <div
                key={mark.value}
                className="absolute top-6 transform -translate-x-1/2"
                style={{ left: `${markPercentage}%` }}
              >
                <div className="w-1 h-1 bg-neutral-400 rounded-full mx-auto mb-1" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {mark.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Slider
