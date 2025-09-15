// 日期工具函数

export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD') => {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return '无效日期'
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const getRelativeTime = (date: Date | string) => {
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

export const isToday = (date: Date | string) => {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export const isYesterday = (date: Date | string) => {
  const d = new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return d.toDateString() === yesterday.toDateString()
}

export const isThisWeek = (date: Date | string) => {
  const d = new Date(date)
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))
  return d >= startOfWeek && d <= endOfWeek
}

export const isThisMonth = (date: Date | string) => {
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export const isThisYear = (date: Date | string) => {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
}

export const addDays = (date: Date | string, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const addMonths = (date: Date | string, months: number) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export const addYears = (date: Date | string, years: number) => {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

export const getStartOfDay = (date: Date | string) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getEndOfDay = (date: Date | string) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export const getStartOfWeek = (date: Date | string) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  const startOfWeek = new Date(d.setDate(diff))
  startOfWeek.setHours(0, 0, 0, 0)
  return startOfWeek
}

export const getEndOfWeek = (date: Date | string) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + 6
  const endOfWeek = new Date(d.setDate(diff))
  endOfWeek.setHours(23, 59, 59, 999)
  return endOfWeek
}

export const getStartOfMonth = (date: Date | string) => {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getEndOfMonth = (date: Date | string) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

export const getDaysInMonth = (date: Date | string) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

export const getWeekNumber = (date: Date | string) => {
  const d = new Date(date)
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}

export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export const getAge = (birthDate: Date | string) => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}
