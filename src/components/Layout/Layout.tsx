import { ReactNode } from 'react'
import Header from './Header'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
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
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-auto scrollbar-thin bg-white dark:bg-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout
