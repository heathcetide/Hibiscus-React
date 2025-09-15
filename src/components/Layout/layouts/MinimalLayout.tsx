import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from "@/components/Layout/Header.tsx";

interface MinimalLayoutProps {
  children: ReactNode
}

const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default MinimalLayout

