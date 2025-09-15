// 格式化日期
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short') => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return '无效日期';

  // Define the format options based on the required format
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  };

  // Use the formatOptions for the required format
  return d.toLocaleDateString('zh-CN', formatOptions[format]);
}

// 格式化相对时间
export const formatRelativeTime = (date: Date | string) => {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return '刚刚'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`
  return `${Math.floor(diffInSeconds / 31536000)}年前`
}

// 格式化文件大小
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 格式化数字
export const formatNumber = (num: number, options?: {
  decimals?: number
  thousands?: boolean
  currency?: string
}) => {
  const { decimals = 0, thousands = true, currency } = options || {}
  
  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: thousands
  }
  
  if (currency) {
    formatOptions.style = 'currency'
    formatOptions.currency = currency
  }
  
  return new Intl.NumberFormat('zh-CN', formatOptions).format(num)
}

// 格式化百分比
export const formatPercentage = (value: number, decimals: number = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

// 截断文本
export const truncateText = (text: string, maxLength: number, suffix: string = '...') => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

// 首字母大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// 驼峰转换
export const toCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// 短横线转换
export const toKebabCase = (str: string) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
