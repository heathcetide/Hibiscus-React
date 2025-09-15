// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(this: any, ...args: Parameters<T>) { // Add this: any to fix 'this' context
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(this: any, ...args: Parameters<T>) { // Add this: any to fix 'this' context
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 请求去重
class RequestDeduplicator {
  private cache = new Map<string, Promise<any>>()

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }

    const promise = requestFn()
    this.cache.set(key, promise)

    // 请求完成后清理缓存
    promise.finally(() => {
      this.cache.delete(key)
    })

    return promise
  }

  clear() {
    this.cache.clear()
  }
}

export const requestDeduplicator = new RequestDeduplicator()

// 图片懒加载
export function createLazyImageObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// 预加载资源
export function preloadResource(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' = 'script'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload ${href}`))
    document.head.appendChild(link)
  })
}

// 批量预加载
export async function preloadResources(
  resources: Array<{ href: string; as: 'script' | 'style' | 'image' | 'font' | 'fetch' }>
): Promise<void> {
  const promises = resources.map(resource => 
    preloadResource(resource.href, resource.as)
  )
  await Promise.all(promises)
}

// 性能测量
export class PerformanceMeasurer {
  private measurements = new Map<string, number>()

  start(name: string): void {
    this.measurements.set(name, performance.now())
  }

  end(name: string): number {
    const startTime = this.measurements.get(name)
    if (!startTime) {
      console.warn(`No start time found for measurement: ${name}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.measurements.delete(name)
    return duration
  }

  measure<T>(name: string, fn: () => T): T {
    this.start(name)
    const result = fn()
    const duration = this.end(name)
    console.log(`${name} took ${duration.toFixed(2)}ms`)
    return result
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name)
    const result = await fn()
    const duration = this.end(name)
    console.log(`${name} took ${duration.toFixed(2)}ms`)
    return result
  }
}

export const performanceMeasurer = new PerformanceMeasurer()

// 内存使用监控
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }
  }
  return null
}

// 网络信息
export function getNetworkInfo() {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  return null
}

// 设备信息
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    memory: getMemoryUsage(),
    network: getNetworkInfo()
  }
}

// 页面可见性检测
export function createVisibilityObserver(callback: (isVisible: boolean) => void) {
  const handleVisibilityChange = () => {
    callback(!document.hidden)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

// 页面卸载前清理
export function createCleanupManager() {
  const cleanupFunctions: (() => void)[] = []

  const add = (fn: () => void) => {
    cleanupFunctions.push(fn)
  }

  const cleanup = () => {
    cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    })
    cleanupFunctions.length = 0
  }

  // 页面卸载时自动清理
  window.addEventListener('beforeunload', cleanup)

  return { add, cleanup }
}

// 批量DOM操作
export function batchDOMUpdates(updates: (() => void)[]) {
  // 使用 requestAnimationFrame 批量执行DOM更新
  requestAnimationFrame(() => {
    updates.forEach(update => update())
  })
}

// 虚拟滚动计算
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  itemCount: number
  scrollTop: number
  overscan?: number
}

export function calculateVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  scrollTop,
  overscan = 5
}: VirtualScrollOptions) {
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2)
  const offsetY = startIndex * itemHeight

  return {
    startIndex,
    endIndex,
    visibleCount,
    offsetY,
    totalHeight: itemCount * itemHeight
  }
}

// 图片压缩
export function compressImage(
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxWidth / height)
      
      canvas.width = width * ratio
      canvas.height = height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/jpeg',
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// 缓存管理
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cacheManager = new CacheManager()

// 定期清理过期缓存
setInterval(() => {
  cacheManager.cleanup()
}, 60000) // 每分钟清理一次
