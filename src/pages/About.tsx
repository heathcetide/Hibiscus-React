import { motion } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Heart
} from 'lucide-react'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/Card'
import FadeIn from '../components/Animations/FadeIn'
import StaggeredList from '../components/Animations/StaggeredList'

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: '专注质量',
      description: '我们致力于提供高质量、经过充分测试的代码，确保每个组件都经过精心打磨。',
    },
    {
      icon: <Eye className="w-8 h-8 text-secondary-600" />,
      title: '用户体验',
      description: '以用户为中心的设计理念，创造直观、美观、易用的界面体验。',
    },
    {
      icon: <Users className="w-8 h-8 text-accent-600" />,
      title: '社区驱动',
      description: '倾听社区反馈，持续改进和优化，与开发者共同成长。',
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: '创新精神',
      description: '不断探索新技术，将最佳实践融入到我们的解决方案中。',
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: '项目启动',
      description: '开始构建 React 模板项目，确定技术栈和设计方向。',
    },
    {
      year: '2024',
      title: '核心功能完成',
      description: '完成基础组件库、动画系统和布局组件的开发。',
    },
    {
      year: '2024',
      title: '开源发布',
      description: '在 GitHub 上开源发布，获得社区广泛关注。',
    },
    {
      year: '2024',
      title: '持续优化',
      description: '根据用户反馈持续优化，添加新功能和改进。',
    },
  ]

  const team = [
    {
      name: '张三',
      role: '前端架构师',
      avatar: 'Z',
      description: '专注于 React 生态系统和用户体验设计。',
    },
    {
      name: '李四',
      role: 'UI/UX 设计师',
      avatar: 'L',
      description: '负责视觉设计和交互体验优化。',
    },
    {
      name: '王五',
      role: '全栈工程师',
      avatar: 'W',
      description: '负责后端集成和性能优化。',
    },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <FadeIn direction="up">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            关于我们
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            我们是一支充满激情的团队，致力于为开发者提供最优质的 React 模板和组件库。
            通过我们的努力，让每个项目都能拥有出色的用户体验和现代化的界面设计。
          </p>
        </FadeIn>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h2 className="text-4xl font-display font-bold mb-6">
                  我们的使命
                </h2>
                <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                  让每个开发者都能快速构建出美观、现代、高性能的 React 应用。
                  我们相信，好的工具能够激发创造力，让开发者专注于真正重要的事情。
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-neutral-700">
                      提供开箱即用的高质量组件库
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-neutral-700">
                      持续优化性能和用户体验
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-neutral-700">
                      建立活跃的开发者社区
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">用心制作</h3>
                    <p className="text-neutral-600">
                      每一个组件都经过精心设计和反复测试，确保质量和易用性。
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6">
              我们的价值观
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              这些核心价值观指导着我们的每一个决策和行动。
            </p>
          </FadeIn>
          
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <motion.div
                key={value.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card hover className="h-full text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6">
              发展历程
            </h2>
            <p className="text-xl text-neutral-600">
              回顾我们的成长轨迹和重要里程碑。
            </p>
          </FadeIn>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 to-primary-800"></div>
            <StaggeredList className="space-y-12">
              {milestones.map((milestone) => (
                <motion.div
                  key={milestone.year}
                  whileHover={{ x: 10 }}
                  className="relative flex items-start space-x-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        <CardDescription className="text-sm text-primary font-medium">
                          {milestone.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-neutral-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </StaggeredList>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6">
              我们的团队
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              一群热爱技术的开发者，致力于创造更好的开发体验。
            </p>
          </FadeIn>
          
          <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card hover className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                      {member.avatar}
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600">{member.description}</p>
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
            <h2 className="text-4xl font-display font-bold mb-6">
              加入我们的社区
            </h2>
            <p className="text-xl mb-8 opacity-90">
              与我们一起构建更好的 React 生态系统，分享经验，共同成长。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-medium hover:bg-neutral-100 transition-colors"
              >
                加入社区
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
              >
                贡献代码
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

export default About
