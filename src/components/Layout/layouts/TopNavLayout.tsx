import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from '../Header'

interface TopNavLayoutProps {
  children: ReactNode
}

const TopNavLayout = ({ children }: TopNavLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <Header
        logo={{
            text: 'WriteWiz',
            subtext: 'Professional Services',
            image: '/public/icon-192x192.svg',
            href: '/'
        }}
    />
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default TopNavLayout

