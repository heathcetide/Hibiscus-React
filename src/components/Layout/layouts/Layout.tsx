import { ReactNode } from 'react'
import Header from '../Header.tsx'
import { motion } from 'framer-motion'
import Sidebar from "@/components/Layout/Sidebar.tsx";

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <Header
                logo={{
                    text: 'WriteWiz',
                    subtext: 'Professional Services',
                    image: '/public/icon-192x192.svg',
                    href: '/'
                }}
            />
            {/* 关键：让子项可以在 flex 容器内收缩 */}
            <div className="flex flex-1 min-h-0">
                <Sidebar />
                {/* 关键：限制 main 的最大高度为 90vh，并避免自身滚动干扰 */}
                <main className="flex-1 p-6 lg:p-8 min-h-0 max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800">
                    {/* 关键：真正滚动的容器，超出 90vh 时出现滚动条 */}
                    <div className="h-full max-h-[90vh] overflow-auto scrollbar-thin">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
