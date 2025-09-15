// 开发环境配置优化

// 检查是否为开发环境
export const isDev = process.env.NODE_ENV === 'development'

// 开发环境下的控制台样式
export const devConsole = {
  log: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`%c[DEV] ${message}`, 'color: #3b82f6; font-weight: bold', ...args)
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`%c[DEV] ${message}`, 'color: #f59e0b; font-weight: bold', ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    if (isDev) {
      console.error(`%c[DEV] ${message}`, 'color: #ef4444; font-weight: bold', ...args)
    }
  }
}

// 开发环境下的性能监控
export const devPerformance = {
  measure: (name: string, fn: () => void) => {
    if (isDev) {
      const start = performance.now()
      fn()
      const end = performance.now()
      devConsole.log(`${name} took ${(end - start).toFixed(2)}ms`)
    } else {
      fn()
    }
  },
  
  measureAsync: async (name: string, fn: () => Promise<any>) => {
    if (isDev) {
      const start = performance.now()
      const result = await fn()
      const end = performance.now()
      devConsole.log(`${name} took ${(end - start).toFixed(2)}ms`)
      return result
    } else {
      return await fn()
    }
  }
}

// 开发环境下的错误边界配置
export const devErrorConfig = {
  showDetails: isDev,
  enableRecovery: true,
  logErrors: isDev
}

// 开发环境下的性能监控配置
export const devPerformanceConfig = {
  showMetrics: isDev,
  showMemory: isDev,
  showNetwork: isDev,
  autoHide: !isDev,
  hideDelay: isDev ? 0 : 10000
}

// 开发环境下的PWA配置
export const devPWAConfig = {
  showOnLoad: true,
  delay: isDev ? 2000 : 5000, // 开发环境下更快显示
  position: 'bottom-right' as const
}

// 开发环境下的热重载优化
export const devHMRConfig = {
  enabled: isDev,
  port: 3001,
  host: 'localhost'
}

// 开发环境下的调试工具
export const devTools = {
  // 显示组件渲染次数
  renderCount: new Map<string, number>(),
  
  // 记录组件渲染
  logRender: (componentName: string) => {
    if (isDev) {
      const count = devTools.renderCount.get(componentName) || 0
      devTools.renderCount.set(componentName, count + 1)
      devConsole.log(`${componentName} rendered ${count + 1} times`)
    }
  },
  
  // 重置渲染计数
  resetRenderCount: () => {
    if (isDev) {
      devTools.renderCount.clear()
    }
  }
}

// 开发环境下的网络请求监控
export const devNetworkMonitor = {
  requests: new Map<string, { start: number; end?: number }>(),
  
  startRequest: (url: string) => {
    if (isDev) {
      devNetworkMonitor.requests.set(url, { start: performance.now() })
      devConsole.log(`Starting request to ${url}`)
    }
  },
  
  endRequest: (url: string) => {
    if (isDev) {
      const request = devNetworkMonitor.requests.get(url)
      if (request) {
        request.end = performance.now()
        const duration = request.end - request.start
        devConsole.log(`Request to ${url} completed in ${duration.toFixed(2)}ms`)
        devNetworkMonitor.requests.delete(url)
      }
    }
  }
}

// 开发环境下的内存监控
export const devMemoryMonitor = {
  getMemoryUsage: () => {
    if (isDev && 'memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
      }
    }
    return null
  },
  
  logMemoryUsage: () => {
    if (isDev) {
      const memory = devMemoryMonitor.getMemoryUsage()
      if (memory) {
        devConsole.log(`Memory: ${memory.used}MB / ${memory.limit}MB (${memory.total}MB total)`)
      }
    }
  }
}

// 开发环境下的组件性能分析
export const devComponentProfiler = {
  components: new Map<string, { renderTime: number; renderCount: number }>(),
  
  startRender: (componentName: string) => {
    if (isDev) {
      const start = performance.now()
      return () => {
        const end = performance.now()
        const renderTime = end - start
        const component = devComponentProfiler.components.get(componentName) || { renderTime: 0, renderCount: 0 }
        component.renderTime += renderTime
        component.renderCount += 1
        devComponentProfiler.components.set(componentName, component)
        
        if (component.renderCount % 10 === 0) {
          devConsole.log(`${componentName}: avg ${(component.renderTime / component.renderCount).toFixed(2)}ms over ${component.renderCount} renders`)
        }
      }
    }
    return () => {}
  }
}

export default {
  isDev,
  console: devConsole,
  performance: devPerformance,
  error: devErrorConfig,
  performanceMonitor: devPerformanceConfig,
  pwa: devPWAConfig,
  hmr: devHMRConfig,
  tools: devTools,
  network: devNetworkMonitor,
  memory: devMemoryMonitor,
  profiler: devComponentProfiler
}
