import { useState } from 'react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Slider from '../components/UI/Slider'
import Stepper from '../components/UI/Stepper'
import Tooltip from '../components/UI/Tooltip'
import Popover from '../components/UI/Popover'
import StatCard from '../components/Data/StatCard'
import Timeline from '../components/Data/Timeline'
import ProgressBar from '../components/Data/ProgressBar'
import PageHeader from '../components/Layout/PageHeader'
import PageContainer from '../components/Layout/PageContainer'
import { Grid } from '../components/Layout/Grid'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { useClickOutside } from '../hooks/useClickOutside'
import { useWindowSize } from '../hooks/useWindowSize'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'
import InfiniteScroll from "@/components/UI/InfiniteScroll.tsx";
import VirtualList from "@/components/UI/VirtualList.tsx";

const AdvancedShowcase = () => {
  const [sliderValue, setSliderValue] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPopover, setShowPopover] = useState(false)
  const [showClickOutside, setShowClickOutside] = useState(false)
  const [infiniteItems, setInfiniteItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1))
  const [hasMore, setHasMore] = useState(true)
  
  const { copy, copied } = useCopyToClipboard()
  const clickOutsideRef = useClickOutside(() => setShowClickOutside(false))
  const { width, height } = useWindowSize()

  const stepperSteps = [
    {
      id: '1',
      title: '创建账户',
      description: '填写基本信息',
      completed: currentStep > 0
    },
    {
      id: '2',
      title: '验证邮箱',
      description: '检查邮箱验证码',
      completed: currentStep > 1
    },
    {
      id: '3',
      title: '完善资料',
      description: '上传头像和设置偏好',
      completed: currentStep > 2
    },
    {
      id: '4',
      title: '完成设置',
      description: '开始使用应用',
      completed: currentStep > 3
    }
  ]

  const timelineItems = [
    {
      id: '1',
      title: '项目启动',
      description: '开始新的写作项目',
      time: '2024-01-15',
      status: 'completed' as const,
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: '2',
      title: '需求分析',
      description: '分析用户需求和市场调研',
      time: '2024-01-20',
      status: 'completed' as const,
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: '3',
      title: '设计阶段',
      description: 'UI/UX 设计和原型制作',
      time: '2024-02-01',
      status: 'current' as const,
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: '4',
      title: '开发阶段',
      description: '前端和后端开发',
      time: '2024-02-15',
      status: 'upcoming' as const,
      icon: <Star className="w-4 h-4" />
    }
  ]

  const virtualListData = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `项目 ${i + 1}`,
    description: `这是第 ${i + 1} 个项目的描述`
  }))

  const handleLoadMore = () => {
    setTimeout(() => {
      const newItems = Array.from(
        { length: 10 }, 
        (_, i) => infiniteItems.length + i + 1
      )
      setInfiniteItems(prev => [...prev, ...newItems])
      if (infiniteItems.length >= 100) {
        setHasMore(false)
      }
    }, 1000)
  }

  const handleCopy = async () => {
    await copy('这是要复制的文本内容')
  }

  // @ts-ignore
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <PageContainer>
        <PageHeader
          title="高级组件展示"
          subtitle="展示所有高级 UI 组件和功能"
          breadcrumbs={[
            { label: '首页', href: '/' },
            { label: '高级组件展示' }
          ]}
        />

        <div className="space-y-8">
          {/* 统计卡片 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">统计卡片</h3>
            <Grid cols={4} gap="md">
              <StatCard
                title="总用户"
                value="12,345"
                change={{ value: 12, type: 'increase' }}
                icon={Users}
                iconColor="text-blue-600"
              />
              <StatCard
                title="总收入"
                value="¥89,123"
                change={{ value: 8, type: 'increase' }}
                icon={DollarSign}
                iconColor="text-green-600"
              />
              <StatCard
                title="活跃度"
                value="94%"
                change={{ value: 2, type: 'decrease' }}
                icon={Activity}
                iconColor="text-purple-600"
              />
              <StatCard
                title="增长率"
                value="23%"
                change={{ value: 5, type: 'increase' }}
                icon={TrendingUp}
                iconColor="text-orange-600"
              />
            </Grid>
          </Card>

          {/* 滑块组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">滑块组件</h3>
            <div className="space-y-6">
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
                label="音量控制"
                showValue
              />
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
                label="亮度调节"
                showValue
                marks={[
                  { value: 0, label: '最暗' },
                  { value: 50, label: '中等' },
                  { value: 100, label: '最亮' }
                ]}
              />
            </div>
          </Card>

          {/* 步骤器组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">步骤器组件</h3>
            <div className="space-y-6">
              <Stepper
                steps={stepperSteps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  上一步
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(stepperSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === stepperSteps.length - 1}
                >
                  下一步
                </Button>
              </div>
            </div>
          </Card>

          {/* 工具提示和弹出框 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">工具提示和弹出框</h3>
            <div className="flex gap-4">
              <Tooltip content="这是一个工具提示">
                <Button>悬停查看提示</Button>
              </Tooltip>
              
              <Popover
                content={
                  <div className="p-4">
                    <h4 className="font-medium mb-2">弹出框内容</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      这是一个弹出框的示例内容
                    </p>
                  </div>
                }
                open={showPopover}
                onOpenChange={setShowPopover}
              >
                <Button>点击打开弹出框</Button>
              </Popover>
            </div>
          </Card>

          {/* 时间线组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">时间线组件</h3>
            <Timeline items={timelineItems} />
          </Card>

          {/* 进度条组件 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">进度条组件</h3>
            <div className="space-y-4">
              <ProgressBar
                value={75}
                label="项目进度"
                description="还有 25% 完成"
                variant="default"
              />
              <ProgressBar
                value={60}
                label="任务完成度"
                description="进行中"
                variant="success"
              />
              <ProgressBar
                value={30}
                label="错误率"
                description="需要改进"
                variant="error"
              />
            </div>
          </Card>

          {/* 无限滚动 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">无限滚动</h3>
            <div className="h-64 overflow-y-auto">
              <InfiniteScroll
                hasMore={hasMore}
                loadMore={handleLoadMore}
              >
                <div className="space-y-2">
                  {infiniteItems.map((item) => (
                    <div
                      key={item}
                      className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded"
                    >
                      项目 {item}
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </Card>

          {/* 虚拟列表 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">虚拟列表 (1000 项)</h3>
            <VirtualList
              items={virtualListData}
              itemHeight={40}
              containerHeight={300}
              renderItem={(item) => (
                <div className="p-2 border-b border-neutral-200 dark:border-neutral-700">
                  {item.name} - {item.description}
                </div>
              )}
            />
          </Card>

          {/* 工具函数演示 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">工具函数演示</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={handleCopy}>
                  {copied ? '已复制!' : '复制到剪贴板'}
                </Button>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  点击按钮复制文本到剪贴板
                </span>
              </div>

              <div ref={clickOutsideRef as React.RefObject<HTMLDivElement>} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  点击外部区域关闭此框
                </p>
                {showClickOutside && (
                  <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                    已点击外部区域
                  </div>
                )}
              </div>
              
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                当前窗口尺寸: {width} x {height}
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}

export default AdvancedShowcase
