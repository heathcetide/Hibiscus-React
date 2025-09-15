import { motion } from 'framer-motion'
import {
    ArrowRight,
    Sparkles,
    Zap,
    Shield,
    Heart,
    Users,
    Code,
    Smartphone,
    BookOpen
} from 'lucide-react'
import Button from '../components/UI/Button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card'
import FadeIn from '../components/Animations/FadeIn'
import StaggeredList from '../components/Animations/StaggeredList'
import {Typewriter} from "@/components/UX/MicroInteractions.tsx";

const Home = () => {

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: '极速开发',
            description: '基于 Vite 构建，热重载速度极快，让开发体验更加流畅。',
        },
        {
            icon: <BookOpen className="w-8 h-8 text-secondary-600" />,
            title: '小说写作',
            description: '完整的写作管理系统，支持项目、小说、章节的层级管理。',
        },
        {
            icon: <Code className="w-8 h-8 text-accent-600" />,
            title: 'TypeScript',
            description: '完整的 TypeScript 支持，提供更好的开发体验和代码质量。',
        },
        {
            icon: <Smartphone className="w-8 h-8 text-primary" />,
            title: '响应式设计',
            description: '完美适配各种设备尺寸，从手机到桌面都有出色的体验。',
        },
        {
            icon: <Shield className="w-8 h-8 text-secondary-600" />,
            title: '安全可靠',
            description: '遵循最佳实践，内置安全防护，让您的应用更加安全。',
        },
        {
            icon: <Heart className="w-8 h-8 text-accent-600" />,
            title: '易于使用',
            description: '简洁的 API 设计，丰富的文档，让您快速上手。',
        },
    ]

    const stats = [
        { label: '组件数量', value: '50+', icon: <Code className="w-6 h-6" /> },
        { label: '动画效果', value: '20+', icon: <Sparkles className="w-6 h-6" /> },
        { label: '用户满意', value: '99%', icon: <Heart className="w-6 h-6" /> },
        { label: '活跃用户', value: '10K+', icon: <Users className="w-6 h-6" /> },
    ]

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="relative py-20 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto px-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        全新 React 模板发布
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                        <Typewriter
                            text="构建现代化"
                            speed={100}
                            className="block"
                        />
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="gradient-text block"
                        >
                            React 应用
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                    >
                        一个功能完整、设计精美的 React 模板，提供丰富的组件库、动画效果和最佳实践，让您快速构建出色的 Web 应用。
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            立即开始
                        </Button>
                        <Button variant="outline" size="lg">
                            查看文档
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <StaggeredList className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 text-white">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-neutral-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </StaggeredList>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <FadeIn direction="up" className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            为什么选择我们？
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                            我们提供完整的解决方案，让您专注于业务逻辑，而不是重复造轮子。
                        </p>
                    </FadeIn>

                    <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card hover className="h-full">
                                    <CardHeader>
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </StaggeredList>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <FadeIn direction="up">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            准备开始您的项目了吗？
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            立即下载模板，开始构建您的下一个精彩项目。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                下载模板
                            </Button>
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                                查看示例
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    )
}

export default Home
