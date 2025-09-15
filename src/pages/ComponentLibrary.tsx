import React, {useMemo, useState} from 'react'
import {
    Search,
    Menu,
    X,
    Code,
    BookOpen,
    Palette,
    Layers,
    MousePointer,
    Grid,
    List,
    Eye,
    Copy,
    Check,
    ArrowRight, CheckIcon, Heart, FileText,
    Sparkles, MousePointerClick, Zap, VolumeX,
    Star,
    Info,
    AlertTriangle, CheckCircle2, Cloud, Shield, ThumbsUp
} from 'lucide-react'
import Button from '@/components/UI/Button'
import Avatar from '@/components/UI/Avatar'
import Badge from '@/components/UI/Badge'
import Card, {CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/UI/Card'
import Chart from "@/components/UI/Chart.tsx";
import ConfirmDialog from '@/components/UI/ConfirmDialog'
import DatePicker from "@/components/UI/DatePicker.tsx";
import {showAlert} from "@/utils/notification.ts";
import DragDrop, {DragDirection, DragType} from "@/components/UI/DragDrop.tsx";
import DragSort, {DragSortItem} from "@/components/UI/DragSort.tsx";
import EmptyState from "@/components/UI/EmptyState.tsx";
import EnhancedMagneticButton from '@/components/UI/EnhancedMagneticButton'
import EpicRatingEffect from "@/components/UI/EpicRatingEffect.tsx";
import FileUpload from '@/components/UI/FileUpload'
import IconText from '@/components/UI/IconText'
import {HoverCard, Pulse, ScrollReveal, Skeleton, Typewriter} from "@/components/UX/MicroInteractions.tsx";
import PageTurner from "@/components/UI/PageTurner.tsx";

const ComponentLibrary: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 200  // 假设有200页
    // 页数变化时调用
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // 收藏页面
    const handleBookmark = (page: number) => {
        console.log(`页面 ${page} 已收藏`)
    }

    // 自动保存
    const handleAutoSave = (page: number) => {
        console.log(`自动保存到页面 ${page}`)
    }

    // 假设你有一些书签
    const bookmarks = [1, 50, 100]
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [dragData, setDragData] = useState<string | null>(null)
    const [selectedFiles] = useState<File[]>([])
    const [items, setItems] = useState<DragSortItem[]>([
        { id: 1, data: '项 1' },
        { id: 2, data: '项 2' },
        { id: 3, data: '项 3' },
        { id: 4, data: '项 4' },
        { id: 5, data: '项 5' },
    ])
    // 受控分数（0 ~ 100）
    const [score, setScore] = useState(72)
    const maxScore = 100
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    const handleFileSelect = (files: File[]) => {
        console.log('选中的文件:', files)
        setUploadedFiles(files)
    }
    // 交互开关
    const [showAnimation, setShowAnimation] = useState(true)
    const [showParticles, setShowParticles] = useState(true)
    const [showSound, setShowSound] = useState(false) // 开发环境先关掉声音更清净
    const [liked, setLiked] = useState(false)
    // 随机分数
    const randomize = () => {
        const next = Math.floor(Math.random() * (maxScore + 1))
        setScore(next)
    }

    // 一些示例分数
    const levels = useMemo(() => [58, 68, 78, 88, 96], [])
    // 排序后更新项目
    const handleSort = (newItems: DragSortItem[]) => {
        setItems(newItems)
    }
    const handleFileDrop = (droppedFiles: File[]) => {
        setFiles(droppedFiles)
        showAlert(`成功上传 ${droppedFiles.length} 个文件`, 'success', '文件上传')
    }
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date)
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }

    const handleConfirm = () => {
        console.log('Action confirmed!')
        setIsDialogOpen(false)
    }
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    // 组件分类 - 你可以在这里添加你的组件分类
    const categories = [
        { id: 'all', name: '全部组件', icon: <Grid className="w-4 h-4" />, count: 0 },
        { id: 'ui', name: '基础 UI', icon: <Layers className="w-4 h-4" />, count: 0 },
        { id: 'forms', name: '表单组件', icon: <MousePointer className="w-4 h-4" />, count: 0 },
        { id: 'data', name: '数据展示', icon: <BookOpen className="w-4 h-4" />, count: 0 },
        { id: 'layout', name: '布局组件', icon: <Grid className="w-4 h-4" />, count: 0 },
        { id: 'animations', name: '动画效果', icon: <Palette className="w-4 h-4" />, count: 0 }
    ]

    // 组件列表 - 你可以在这里添加你的组件
    const components = [
        {
            id: 'Avatar',
            name: 'Avatar',
            icon: '头像渲染组件，支持多种形态',
            category: 'ui',
            tags: ['基础', '交互', '头像'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <div>
                        <Avatar
                            src="https://codeonezerozero.cn:19000/code100/1756198122678_img-170715024668559b065e06bf642b66ee5ac0eedcd3b9b.jpg"
                            alt="User Avatar"/>
                    </div>
                    <div>
                    <Avatar
                        src="https://codeonezerozero.cn:19000/code100/1756198122678_img-170715024668559b065e06bf642b66ee5ac0eedcd3b9b.jpg"
                        className="border-2 border-blue-500"/>
                    </div>
                    <div>
                    <Avatar
                        src="https://codeonezerozero.cn:19000/code100/1756198122678_img-170715024668559b065e06bf642b66ee5ac0eedcd3b9b.jpg"
                        onClick={() => alert('Avatar clicked!')}
                    />
                    </div>
                    <div>
                    <div className="flex items-center space-x-4">
                        <Avatar src="https://codeonezerozero.cn:19000/code100/1756198122678_img-170715024668559b065e06bf642b66ee5ac0eedcd3b9b.jpg"
                                size="sm"/>
                        <span>John Doe</span>
                    </div>
                    </div>
                    <div>
                    <Avatar fallback="张"/>
                    </div>
                    <div>
                    <Avatar fallback="JD"/>
                    </div>
                    <div>
                    <Avatar fallback="李" size="lg"/>
                    </div>
                    <div>
                    <Avatar fallback="王" size="sm"/>
                    </div>
                </div>
            ),
            code: `<Avatar fallback="Hibiscus"/>`
        },
        {
            id: 'button',
            name: 'Button',
            description: '按钮组件，支持多种样式和状态',
            category: 'ui',
            tags: ['基础', '交互', '按钮'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <Button>主要按钮</Button>
                    <Button variant="secondary">次要按钮</Button>
                    <Button variant="outline">轮廓按钮</Button>
                    <Button variant="ghost">幽灵按钮</Button>
                    <Button size="sm">小按钮</Button>
                    <Button size="lg">大按钮</Button>
                    <Button disabled>禁用按钮</Button>
                    <Button onClick={() => alert('Button clicked!')}>
                        默认按钮
                    </Button>
                    <Button leftIcon={<ArrowRight />} onClick={() => alert('Go home!')}>
                        带图标的按钮
                    </Button>
                    <Button loading onClick={() => alert('Loading...')}>
                        正在加载
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => alert('Primary Large')}>
                        大号主按钮
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert('Outline Small')}>
                        小号边框按钮
                    </Button>
                    <Button animation="bounce" onClick={() => alert('Bouncing button clicked!')}>
                        弹跳动画按钮
                    </Button>
                    <Button animation="pulse" onClick={() => alert('Pulsing button clicked!')}>
                        脉冲动画按钮
                    </Button>
                    <Button fullWidth onClick={() => alert('Full width button clicked!')}>
                        完全宽度按钮
                    </Button>
                    <Button disabled onClick={() => alert('Cannot click this!')}>
                        禁用按钮
                    </Button>
                    <Button enableAudio onClick={() => alert('Audio enabled!')}>
                        启用音效按钮
                    </Button>
                    <Button
                        variant="destructive"
                        size="md"
                        className="custom-class"
                        leftIcon={<ArrowRight />}
                        rightIcon={<ArrowRight />}
                        onClick={() => alert('Advanced usage!')}
                    >
                        高级用法按钮
                    </Button>
                    <Button animation="scale">缩放动画</Button>
                    <Button animation="bounce">弹跳动画</Button>
                    <Button animation="pulse">脉冲动画</Button>
                    <Button animation="slide">滑动动画</Button>
                    <Button animation="none">无动画</Button>
                </div>
            ),
            code: `<Button>主要按钮</Button>`
        },
        {
            id: 'card',
            name: 'Card',
            description: '卡片组件，用于内容展示',
            category: 'ui',
            tags: ['基础', '布局', '卡片'],
            demo: () => (
                <div>
                    <h4 className="text-md font-medium text-neutral-900 dark:text-white mb-3">卡片</h4>
                    <div className="space-y-3">
                        <Card animation="fade" delay={0}>淡入动画</Card>
                        <Card animation="slide" delay={0.1}>滑动动画</Card>
                        <Card animation="scale" delay={0.2}>缩放动画</Card>
                        <Card animation="flip" delay={0.3}>翻转动画</Card>
                        <Card hover>悬停效果</Card>
                        <Card>
                            <div>
                                <h2>This is a simple card</h2>
                                <p>It doesn't have a title or actions, just content.</p>
                            </div>
                        </Card>
                        <Card
                            title="Card Title"
                            subtitle="This is the card subtitle"
                            actions={<Button>Click Me</Button>}
                            variant="outlined"
                            padding="md"
                            hover={true}
                        >
                            <CardDescription>
                                This card has both a title and a subtitle. The card body is for additional content.
                            </CardDescription>
                            <CardFooter>
                                <Button variant="outline" onClick={() => alert('Footer Button clicked!')}>
                                    Footer Action
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card
                            title="Animated Card"
                            subtitle="This card uses fade animation"
                            animation="fade"
                            delay={0.2}
                            padding="lg"
                        >
                            <p>This content fades in when the card appears.</p>
                        </Card>
                        <Card
                            title="Click Me!"
                            padding="sm"
                            className="border border-gray-300 bg-gray-100"
                            onClick={() => alert('Footer Button clicked!')}
                            variant="filled"
                        >
                            <p>This card has a click handler and custom styles.</p>
                        </Card>
                        <Card variant="glass" padding="lg">
                            <CardTitle>Editable Card</CardTitle>
                            <CardDescription>This card contains editable content.</CardDescription>
                            <CardContent>
                                <input type="text" placeholder="Enter some text here..." />
                            </CardContent>
                        </Card>
                        <Card variant="elevated" padding="md">
                            <CardHeader className="bg-gray-200 p-4">
                                <h2 className="text-xl font-bold">Custom Card Header</h2>
                            </CardHeader>
                            <CardContent>
                                <p>This is the body content of the card. It could be any custom component.</p>
                            </CardContent>
                            <CardFooter className="bg-gray-200 p-4">
                                <Button>Footer Action</Button>
                            </CardFooter>
                        </Card>
                        <Card
                            title="Interactive Card"
                            subtitle="Hover over me!"
                            variant="outlined"
                            hover={true}
                            onClick={() => alert('Card clicked!')}
                            padding="lg"
                        >
                            <p>This card responds to hover and click actions.</p>
                        </Card>
                        <Card title="Main Card" variant="filled" padding="lg">
                            <Card variant="outlined" title="Nested Card 1">
                                <p>This is a nested card inside the main card.</p>
                            </Card>
                            <Card variant="outlined" title="Nested Card 2">
                                <p>This is another nested card inside the main card.</p>
                            </Card>
                        </Card>
                    </div>
                </div>
            ),
            code: `<Card title="Main Card" variant="filled" padding="lg">
                            <Card variant="outlined" title="Nested Card 1">
                                <p>This is a nested card inside the main card.</p>
                            </Card>
                            <Card variant="outlined" title="Nested Card 2">
                                <p>This is another nested card inside the main card.</p>
                            </Card>
                        </Card>`
        },
        {
            id: 'Badge',
            name: 'Badge',
            icon: '徽章组件',
            category: 'ui',
            tags: ['基础', '交互', '徽章'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <Badge>默认</Badge>
                    <Badge variant="success">成功</Badge>
                    <Badge variant="warning">警告</Badge>
                    <Badge variant="error">错误</Badge>
                    <Badge variant="outline">轮廓</Badge>
                    <Badge size="xs">
                        XS Badge
                    </Badge>
                    <Badge size="lg">
                        Large Badge
                    </Badge>
                    <Badge shape="pill" variant="primary">
                        Pill Badge
                    </Badge>
                    <Badge shape="square" variant="success">
                        Square Badge
                    </Badge>
                    <Badge icon={<CheckIcon/>} variant="success">
                        Success
                    </Badge>
                    <Badge icon={<CheckIcon/>} variant="warning" size="lg">
                        Warning
                    </Badge>
                    <Badge animation="bounce" variant="primary">
                        Bouncing Badge
                    </Badge>
                    <Badge animation="pulse" variant="error" size="lg">
                        Pulsing Badge
                    </Badge>
                    <Badge onClick={() => alert('Badge clicked!')} variant="warning">
                        Clickable Badge
                    </Badge>
                    <Badge animation="fade" delay={0.5} variant="muted">
                        Fading Badge with Delay
                    </Badge>
                    <Badge variant="success" size="md" shape="pill" animation="scale">
                        Success Badge
                    </Badge>

                    <Badge variant="outline" size="sm" shape="square" animation="pulse">
                        Outline Badge
                    </Badge>
                    <div className="flex items-center space-x-2">
                        <Badge variant="primary">New</Badge>
                        <span>Item 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="error" size="md" icon={<CheckIcon/>}>
                            Error Badge
                        </Badge>
                        <span>Item 2</span>
                    </div>
                </div>
            ),
            code: `<Badge variant="success" size="md" shape="pill" animation="scale">
                        Success Badge
                    </Badge>`
        },
        {
            id: 'Chart',
            name: 'Chart',
            icon: '图表组件',
            category: 'data',
            tags: ['基础', '交互', '图表'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <Chart
                        data={[
                            { label: 'Q1', value: 15 },
                            { label: 'Q2', value: 30 },
                            { label: 'Q3', value: 45 },
                            { label: 'Q4', value: 60 },
                        ]}
                        type="bar"
                        width={500}
                        height={300}
                        showValues={true}
                        showLegend={false}  // 不显示图例
                    />
                    <Chart
                        data={[
                            { label: 'Q1', value: 15 },
                            { label: 'Q2', value: 30 },
                            { label: 'Q3', value: 45 },
                            { label: 'Q4', value: 60 },
                        ]}
                        type="line"
                        width={600}
                        height={400}
                        showValues={true}  // 显示数据标签
                        showLegend={true}  // 显示图例
                    />
                    <Chart
                        data={[
                            { label: 'Apple', value: 40, color: '#ff0000' },
                            { label: 'Banana', value: 30, color: '#f7d700' },
                            { label: 'Grapes', value: 20, color: '#8e44ad' },
                            { label: 'Pineapple', value: 10, color: '#f39c12' },
                        ]}
                        type="pie"
                        width={400}
                        height={400}
                        showValues={false}  // 不显示数据标签
                        showLegend={true}  // 显示图例
                    />
                    <Chart
                        data={[
                            { label: 'Red', value: 25, color: '#e74c3c' },
                            { label: 'Blue', value: 35, color: '#3498db' },
                            { label: 'Green', value: 40, color: '#2ecc71' },
                        ]}
                        type="doughnut"
                        width={350}
                        height={350}
                        showValues={true}  // 显示数据标签
                        showLegend={true}  // 显示图例
                    />
                    <Chart
                        data={[
                            { label: 'Monday', value: 15 },
                            { label: 'Tuesday', value: 25 },
                            { label: 'Wednesday', value: 35 },
                            { label: 'Thursday', value: 45 },
                            { label: 'Friday', value: 55 },
                        ]}
                        type="bar"
                        width={600}
                        height={350}
                        className="rounded-lg shadow-xl border-2 border-gray-200"
                        showValues={true}
                        showLegend={false}
                    />
                    <Chart
                        data={[
                            { label: 'Product A', value: 80, color: '#e74c3c' },
                            { label: 'Product B', value: 55, color: '#3498db' },
                            { label: 'Product C', value: 95, color: '#2ecc71' },
                        ]}
                        type="bar"
                        width={500}
                        height={300}
                        showValues={true}
                        showLegend={true}  // 显示图例
                    />
                </div>
            ),
            code: `<Chart
                        data={[
                            { label: 'Q1', value: 15 },
                            { label: 'Q2', value: 30 },
                            { label: 'Q3', value: 45 },
                            { label: 'Q4', value: 60 },
                        ]}
                        type="bar"
                        width={500}
                        height={300}
                        showValues={true}
                        showLegend={false}  // 不显示图例
                    />`
        },
        {
            id: 'ConfirmDialog',
            name: 'ConfirmDialog',
            icon: '确定框组件',
            category: 'ui',
            tags: ['基础', '交互', '确定框'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleOpenDialog}>Open Confirm Dialog</Button>

                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Are you sure?"
                        description="This action is irreversible."
                    />

                    <Button onClick={handleOpenDialog}>Open Default Dialog</Button>
                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Default Confirmation"
                        description="This is a default confirmation dialog."
                        variant="default"
                    />

                    <Button onClick={handleOpenDialog}>Open Success Dialog</Button>
                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Success Action"
                        description="This action was successful!"
                        variant="success"
                    />

                    <Button onClick={handleOpenDialog}>Open Warning Dialog</Button>
                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Warning"
                        description="This is a warning. Please be careful."
                        variant="warning"
                    />

                    <Button onClick={handleOpenDialog}>Open Danger Dialog</Button>
                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Danger Zone"
                        description="This action cannot be undone!"
                        variant="danger"
                    />

                    <Button onClick={handleOpenDialog}>Open Custom Button Dialog</Button>

                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Custom Button Example"
                        description="This dialog has custom button texts."
                        confirmText="Yes, I am sure"
                        cancelText="No, go back"
                    />

                    <Button onClick={handleOpenDialog}>Open Dialog with Custom Icon</Button>

                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Custom Icon Dialog"
                        description="This dialog uses a custom icon."
                        icon={<Heart className="w-6 h-6 text-red-500" />}
                    />
                </div>
            ),
            code: `<Button onClick={handleOpenDialog}>Open Dialog with Custom Icon</Button>
                    <ConfirmDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirm}
                        title="Custom Icon Dialog"
                        description="This dialog uses a custom icon."
                        icon={<Heart className="w-6 h-6 text-red-500" />}
                    />`
        },
        {
            id: 'DatePicker',
            name: 'DatePicker',
            icon: '日期选择器组件',
            category: 'ui',
            tags: ['基础', '交互', '日期选择'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        label="选择日期"
                        placeholder="请选择一个日期"
                    />
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        label="日期选择器（禁用）"
                        placeholder="日期不可选"
                        disabled={true}
                    />
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        label="选择日期（有范围）"
                        placeholder="请选择一个日期"
                        minDate={new Date('2023-01-01')}
                        maxDate={new Date('2023-12-31')}
                    />
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        label="自定义样式的日期选择器"
                        placeholder="选择日期"
                        className="max-w-xs"
                    />
                    <form onSubmit={(event: React.FormEvent) => {
                        event.preventDefault()
                        console.log('提交的日期:', selectedDate)
                    }} className="space-y-4">
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            label="选择日期"
                            placeholder="请选择日期"
                        />
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
                            提交
                        </button>
                    </form>
                </div>
            ),
            code: `<DatePicker
                        value={selectedDate}
                        DragDrop={handleDateChange}
                        label="选择日期"
                        placeholder="请选择一个日期"
                      />`
        },
        {
            id: 'DragDrop',
            name: 'DragDrop',
            icon: '拖拽文件上传组件',
            category: 'ui',
            tags: ['基础', '交互', '拖拽文件'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <div className="p-4">
                        <DragDrop
                            type={DragType.FILE}
                            onFileDrop={handleFileDrop}
                            accept="image/*"  // 只接受图片文件
                            maxSize={5 * 1024 * 1024}  // 最大文件大小为 5MB
                            maxFiles={3}  // 最多上传3个文件
                            showOverlay={true}
                            overlayText="拖拽文件到此处"
                        >
                            <div className="border-2 border-dashed p-8 text-center">
                                <p>将文件拖到这里进行上传</p>
                            </div>
                        </DragDrop>

                        <div className="mt-4">
                            <h3>已上传文件:</h3>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="p-4">
                        <DragDrop
                            type={DragType.ELEMENT}
                            draggable={true}
                            dragData="拖拽的元素数据"
                            onElementDrop={(draggedData: any) => {
                                setDragData(`拖拽元素: ${draggedData} 到目标区域`)
                            }}
                            direction={DragDirection.BOTH}  // 支持水平和垂直拖拽
                            snapToGrid={true}
                            gridSize={20}  // 网格大小为20px
                            constrainToParent={true}  // 限制元素拖拽在父容器内
                        >
                            <div className="w-32 h-32 bg-blue-500 text-white flex items-center justify-center cursor-move">
                                拖拽我
                            </div>
                        </DragDrop>

                        <div className="mt-4">
                            <h3>{dragData ? dragData : '尚未拖拽元素'}</h3>
                        </div>
                    </div>
                    <div className="p-4 space-y-6">

                        {/* 文件拖拽区域 */}
                        <DragDrop
                            type={DragType.FILE}
                            onFileDrop={handleFileDrop}
                            accept="image/*"
                            multiple={true}
                            maxSize={5 * 1024 * 1024}
                            maxFiles={3}
                            showOverlay={true}
                            overlayText="拖拽文件到此处"
                        >
                            <div className="border-2 border-dashed p-8 text-center">
                                <p>将文件拖到这里进行上传</p>
                            </div>
                        </DragDrop>

                        {/* 元素拖拽区域 */}
                        <DragDrop
                            type={DragType.ELEMENT}
                            draggable={true}
                            dragData="拖拽的元素数据"
                            onElementDrop={(draggedData: any) => {
                                setDragData(`拖拽元素: ${draggedData} 到目标区域`)
                            }}
                            direction={DragDirection.BOTH}
                            snapToGrid={true}
                            gridSize={20}
                            constrainToParent={true}
                        >
                            <div className="w-32 h-32 bg-green-500 text-white flex items-center justify-center cursor-move">
                                拖拽我
                            </div>
                        </DragDrop>

                        <div className="mt-4">
                            <h3>已上传文件:</h3>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                                ))}
                            </ul>
                            <h3>{dragData ? dragData : '尚未拖拽元素'}</h3>
                        </div>
                    </div>
                    <form onSubmit={(e: React.FormEvent) => {
                        e.preventDefault()
                        alert('文件已提交: ' + selectedFiles.map(file => file.name).join(', '))
                    }} className="p-4">
                        <h2>文件上传</h2>
                        <DragDrop
                            type={DragType.FILE}
                            onFileDrop={handleFileDrop}
                            accept="image/*"
                            multiple={true}
                            showOverlay={true}
                            overlayText="拖拽文件到此处"
                        >
                            <div className="border-2 border-dashed p-8 text-center">
                                <p>将文件拖到这里进行上传</p>
                            </div>
                        </DragDrop>

                        <div className="mt-4">
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">提交文件</button>
                        </div>
                    </form>
                </div>
            ),
            code: `<DragDrop
                            type={DragType.FILE}
                            onFileDrop={handleFileDrop}
                            accept="image/*"
                            multiple={true}
                            maxSize={5 * 1024 * 1024}
                            maxFiles={3}
                            showOverlay={true}
                            overlayText="拖拽文件到此处"
                        >
                            <div className="border-2 border-dashed p-8 text-center">
                                <p>将文件拖到这里进行上传</p>
                            </div>
                        </DragDrop>`
        },
        {
            id: 'DragSort',
            name: 'DragSort',
            icon: '拖拽组件',
            category: 'animations',
            tags: ['基础', '交互', '拖拽文件'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <div className="p-6">
                        <h2>拖拽排序列表</h2>
                        <DragSort items={items} onSort={handleSort} direction="vertical" gap={10}>
                            {(item, isDragging) => (
                                <div
                                    className={`p-4 mb-2 bg-gray-200 rounded-lg ${isDragging ? 'bg-gray-300' : ''}`}
                                    style={{ cursor: 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>
                    </div>
                    <div className="p-6">
                        <h2>拖拽排序，带禁用项</h2>
                        <DragSort items={items} onSort={handleSort} direction="vertical" gap={10}>
                            {(item, isDragging) => (
                                <div
                                    className={`p-4 mb-2 bg-gray-200 rounded-lg ${isDragging ? 'bg-gray-300' : ''} ${item.disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                                    style={{ cursor: item.disabled ? 'not-allowed' : 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>
                    </div>
                    <div className="p-6">
                        <h2>水平拖拽排序</h2>
                        <DragSort items={items} onSort={handleSort} direction="horizontal" gap={20}>
                            {(item, isDragging) => (
                                <div
                                    className={`p-4 bg-gray-200 rounded-lg ${isDragging ? 'bg-gray-300' : ''}`}
                                    style={{ cursor: 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>
                    </div>
                    <div className="p-6">
                        <h2>拖拽排序，带占位符</h2>
                        <DragSort
                            items={items}
                            onSort={handleSort}
                            direction="vertical"
                            gap={10}
                            placeholder={<div className="h-12 bg-gray-300 text-center">放置此处</div>}
                            placeholderClassName="bg-gray-100"
                            animation={true}
                            animationDuration={300}
                        >
                            {(item, isDragging) => (
                                <div
                                    className={`p-4 mb-2 bg-gray-200 rounded-lg ${isDragging ? 'bg-gray-300' : ''}`}
                                    style={{ cursor: 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>
                    </div>
                </div>
            ),
            code: `<DragSort items={items} onSort={handleSort} direction="horizontal" gap={20}>
                            {(item, isDragging) => (
                                <div
                                    className={\`p-4 bg-gray-200 rounded-lg }\`}
                                    style={{ cursor: 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>`
        },
        {
            id: 'EmptyState',
            name: 'EmptyState',
            icon: '空状态组件',
            category: 'data',
            tags: ['基础', '交互', '空状态'],
            demo: () => (
                <div className="p-6">
                    <EmptyState
                        icon={FileText}  // 使用 lucide 图标
                        title="没有数据"
                        description="当前没有任何数据，请稍后再试或创建新内容"
                        action={{
                            label: "创建新内容",
                            onClick: () => {
                                alert("Action clicked!")
                            }
                        }}
                        className="bg-white shadow-lg rounded-lg"  // 自定义背景和阴影
                        iconClassName="text-blue-500"  // 自定义图标颜色
                        buttonClassName="mt-6 bg-blue-500 text-white hover:bg-blue-600"  // 自定义按钮样式
                    />
                </div>
            ),
            code: `<EmptyState
                        icon={FileText}  // 使用 lucide 图标
                        title="没有数据"
                        description="当前没有任何数据，请稍后再试或创建新内容"
                        action={{
                            label: "创建新内容",
                            onClick: handleActionClick
                        }}
                        className="bg-white shadow-lg rounded-lg"  // 自定义背景和阴影
                        iconClassName="text-blue-500"  // 自定义图标颜色
                        buttonClassName="mt-6 bg-blue-500 text-white hover:bg-blue-600"  // 自定义按钮样式
                    />`
        },
        {
            id: 'EnhancedMagneticButton',
            name: 'EnhancedMagneticButton',
            icon: '增强磁性按钮组件',
            category: 'ui',
            tags: ['基础', '交互', '增强磁性按钮'],
            demo: () => (
                <div className="p-6">
                    {/* 1) 基础用法 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">1) 基础用法</h2>
                        <EnhancedMagneticButton >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <span>Primary / 默认设置</span>
                            </div>
                        </EnhancedMagneticButton>
                    </section>

                    {/* 2) 各种 variant */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">2) Variants</h2>
                        <div className="flex flex-wrap gap-4">
                            <EnhancedMagneticButton variant="primary">Primary</EnhancedMagneticButton>
                            <EnhancedMagneticButton variant="secondary">Secondary</EnhancedMagneticButton>
                            <EnhancedMagneticButton variant="outline">Outline</EnhancedMagneticButton>
                            <EnhancedMagneticButton variant="ghost">Ghost</EnhancedMagneticButton>
                        </div>
                    </section>

                    {/* 3) 不同尺寸 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">3) 尺寸 size</h2>
                        <div className="flex flex-wrap items-end gap-4">
                            <EnhancedMagneticButton size="sm">SM</EnhancedMagneticButton>
                            <EnhancedMagneticButton size="md">MD</EnhancedMagneticButton>
                            <EnhancedMagneticButton size="lg">LG</EnhancedMagneticButton>
                            <EnhancedMagneticButton size="xl">XL</EnhancedMagneticButton>
                        </div>
                    </section>

                    {/* 4) 不同磁力强度 intensity */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">4) 磁力强度 intensity</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <EnhancedMagneticButton intensity={0.15} className="w-full">
                                弱（0.15）
                            </EnhancedMagneticButton>
                            <EnhancedMagneticButton intensity={0.3} className="w-full">
                                中（0.3，默认）
                            </EnhancedMagneticButton>
                            <EnhancedMagneticButton intensity={0.5} className="w-full">
                                强（0.5）
                            </EnhancedMagneticButton>
                        </div>
                    </section>

                    {/* 5) 关闭/开启 音效、涟漪、光晕 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">5) 开关音效/涟漪/光晕</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <EnhancedMagneticButton enableAudio={false} className="w-full">
                                <div className="flex items-center gap-2">
                                    <VolumeX className="w-5 h-5" />
                                    <span>无音效 enableAudio=false</span>
                                </div>
                            </EnhancedMagneticButton>

                            <EnhancedMagneticButton enableRipple={false} className="w-full" variant="outline">
                                无涟漪 enableRipple=false
                            </EnhancedMagneticButton>

                            <EnhancedMagneticButton enableGlow={false} className="w-full" variant="ghost">
                                无光晕 enableGlow=false
                            </EnhancedMagneticButton>
                        </div>
                    </section>

                    {/* 6) 搭配图标和自定义样式 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">6) 图标 & 自定义样式</h2>
                        <div className="flex flex-wrap gap-4">
                            <EnhancedMagneticButton className="rounded-full">
                                <div className="flex items-center gap-2">
                                    <MousePointerClick className="w-5 h-5" />
                                    <span>圆角更大（className）</span>
                                </div>
                            </EnhancedMagneticButton>

                            <EnhancedMagneticButton variant="secondary" size="lg" className="tracking-wide">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span>Secondary + LG + 宽字距</span>
                                </div>
                            </EnhancedMagneticButton>
                        </div>
                    </section>
                </div>
            ),
            code: `<EnhancedMagneticButton className="rounded-full">
                          <div className="flex items-center gap-2">
                                <MousePointerClick className="w-5 h-5" />
                                 <span>圆角更大（className）</span>
                          </div>
                   </EnhancedMagneticButton>`
        },
        {
            id: 'EpicRatingEffect',
            name: 'EpicRatingEffect',
            icon: '特效得分组件',
            category: 'animations',
            tags: ['基础', '交互', '特效得分'],
            demo: () => (
                <div className="p-6 space-y-10">
                    {/* 1) 基础用法（受控） */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">1) 基础用法（受控）</h2>

                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2">
                                <span className="text-sm text-neutral-600">Score</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={maxScore}
                                    value={score}
                                    onChange={(e) => setScore(Number(e.target.value))}
                                />
                                <span className="text-sm w-10 text-right">{score}</span>
                            </label>

                            <button
                                onClick={randomize}
                                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                随机分数
                            </button>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showAnimation}
                                    onChange={(e) => setShowAnimation(e.target.checked)}
                                />
                                <span className="text-sm">动画</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showParticles}
                                    onChange={(e) => setShowParticles(e.target.checked)}
                                />
                                <span className="text-sm">粒子</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showSound}
                                    onChange={(e) => setShowSound(e.target.checked)}
                                />
                                <span className="text-sm">音效</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <EpicRatingEffect
                                score={score}
                                maxScore={maxScore}
                                size="lg"
                                showAnimation={showAnimation}
                                showParticles={showParticles}
                                showSound={showSound}
                                className="mx-auto"
                            />
                        </div>

                        <p className="text-xs text-neutral-500">
                            小贴士：每次分数变化都会触发一次计分动画，动画结束会有粒子爆炸效果与（可选）音效。
                        </p>
                    </section>

                    {/* 2) 不同尺寸 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">2) 不同尺寸（sm / md / lg / xl）</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 place-items-center">
                            <EpicRatingEffect score={levels[0]} size="sm" />
                            <EpicRatingEffect score={levels[1]} size="md" />
                            <EpicRatingEffect score={levels[3]} size="lg" />
                            <EpicRatingEffect score={levels[4]} size="xl" />
                        </div>
                    </section>

                    {/* 3) 批量渲染（排行榜/多条评分） */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">3) 批量渲染（排行榜/多条评分）</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {levels.map((sc, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col items-center gap-3"
                                >
                                    <div className="text-sm text-neutral-500">玩家 #{i + 1}</div>
                                    <EpicRatingEffect
                                        score={sc}
                                        size={i % 2 === 0 ? 'md' : 'lg'}
                                        showAnimation
                                        showParticles
                                        showSound={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4) 纯展示（关闭动画、粒子、声音） */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">4) 纯展示（无动画/无粒子/无音效）</h2>
                        <div className="flex flex-wrap gap-6">
                            <EpicRatingEffect score={95} showAnimation={false} showParticles={false} showSound={false} />
                            <EpicRatingEffect score={75} showAnimation={false} showParticles={false} showSound={false} />
                            <EpicRatingEffect score={55} showAnimation={false} showParticles={false} showSound={false} />
                        </div>
                        <p className="text-xs text-neutral-500">
                            用于静态评分展示，不触发动画迭代与音频。
                        </p>
                    </section>
                </div>
            ),
            code: `<EpicRatingEffect score={55} showAnimation={false} showParticles={false} showSound={false} />`
        },
        {
            id: 'FileUpload',
            name: 'FileUpload',
            icon: '文件上传组件',
            category: 'ui',
            tags: ['基础', '交互', '文件上传'],
            demo: () => (
                <div className="max-w-lg mx-auto p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">文件上传示例</h2>

                    {/* 图片上传示例 */}
                    <FileUpload
                        label="上传图片"
                        accept="image/*"
                        multiple
                        maxSize={5}          // 单个文件最大 5MB
                        maxFiles={3}         // 最多 3 个文件
                        onFileSelect={handleFileSelect}
                    />

                    {/* 文档上传示例 */}
                    <FileUpload
                        label="上传文档"
                        accept=".pdf,.doc,.docx,.txt"
                        maxSize={10}         // 单个文件最大 10MB
                        maxFiles={2}         // 最多 2 个文件
                        onFileSelect={files => console.log('文档文件:', files)}
                    />

                    {/* 禁用状态示例 */}
                    <FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />

                    {/* 已上传文件展示 */}
                    {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium">已上传文件:</h3>
                            <ul className="list-disc pl-6 mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                                {uploadedFiles.map(file => (
                                    <li key={file.name}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ),
            code: `<FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />`
        },
        {
            id: 'FileUpload',
            name: 'FileUpload',
            icon: '文件上传组件',
            category: 'ui',
            tags: ['基础', '交互', '文件上传'],
            demo: () => (
                <div className="max-w-lg mx-auto p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">文件上传示例</h2>

                    {/* 图片上传示例 */}
                    <FileUpload
                        label="上传图片"
                        accept="image/*"
                        multiple
                        maxSize={5}          // 单个文件最大 5MB
                        maxFiles={3}         // 最多 3 个文件
                        onFileSelect={handleFileSelect}
                    />

                    {/* 文档上传示例 */}
                    <FileUpload
                        label="上传文档"
                        accept=".pdf,.doc,.docx,.txt"
                        maxSize={10}         // 单个文件最大 10MB
                        maxFiles={2}         // 最多 2 个文件
                        onFileSelect={files => console.log('文档文件:', files)}
                    />

                    {/* 禁用状态示例 */}
                    <FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />

                    {/* 已上传文件展示 */}
                    {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium">已上传文件:</h3>
                            <ul className="list-disc pl-6 mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                                {uploadedFiles.map(file => (
                                    <li key={file.name}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ),
            code: `<FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />`
        },
        {
            id: 'FileUpload',
            name: 'FileUpload',
            icon: '文件上传组件',
            category: 'ui',
            tags: ['基础', '交互', '文件上传'],
            demo: () => (
                <div className="max-w-lg mx-auto p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">文件上传示例</h2>

                    {/* 图片上传示例 */}
                    <FileUpload
                        label="上传图片"
                        accept="image/*"
                        multiple
                        maxSize={5}          // 单个文件最大 5MB
                        maxFiles={3}         // 最多 3 个文件
                        onFileSelect={handleFileSelect}
                    />

                    {/* 文档上传示例 */}
                    <FileUpload
                        label="上传文档"
                        accept=".pdf,.doc,.docx,.txt"
                        maxSize={10}         // 单个文件最大 10MB
                        maxFiles={2}         // 最多 2 个文件
                        onFileSelect={files => console.log('文档文件:', files)}
                    />

                    {/* 禁用状态示例 */}
                    <FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />

                    {/* 已上传文件展示 */}
                    {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium">已上传文件:</h3>
                            <ul className="list-disc pl-6 mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                                {uploadedFiles.map(file => (
                                    <li key={file.name}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ),
            code: `<FileUpload
                        label="禁用上传"
                        disabled
                        onFileSelect={() => {}}
                    />`
        },
        {
            id: 'IconText',
            name: 'IconText',
            icon: '图标文字组件',
            category: 'ui',
            tags: ['基础', '交互', '图标文字'],
            demo: () => (
                <div className="p-6 space-y-10">
                    {/* 1) 基本用法 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">1) 基本用法</h2>
                        <IconText icon={<Info />} variant="default">
                            默认风格文字
                        </IconText>
                    </section>

                    {/* 2) 不同尺寸 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">2) 不同尺寸 size</h2>
                        <div className="flex flex-wrap items-center gap-6">
                            <IconText icon={<Star />} size="xs">XS 极小</IconText>
                            <IconText icon={<Star />} size="sm">SM 小</IconText>
                            <IconText icon={<Star />} size="md">MD 中（默认）</IconText>
                            <IconText icon={<Star />} size="lg">LG 大</IconText>
                            <IconText icon={<Star />} size="xl">XL 超大</IconText>
                        </div>
                    </section>

                    {/* 3) 不同变体 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">3) 颜色变体 variant</h2>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                            <IconText icon={<Info />} variant="default">Default</IconText>
                            <IconText icon={<Zap />} variant="primary">Primary</IconText>
                            <IconText icon={<Cloud />} variant="secondary">Secondary</IconText>
                            <IconText icon={<CheckCircle2 />} variant="success">Success</IconText>
                            <IconText icon={<AlertTriangle />} variant="warning">Warning</IconText>
                            <IconText icon={<Shield />} variant="error">Error</IconText>
                            <IconText icon={<ThumbsUp />} variant="muted">Muted</IconText>
                        </div>
                    </section>

                    {/* 4) 方向 & 间距 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">4) 方向 direction & 间距 spacing</h2>
                        <div className="flex flex-wrap gap-8">
                            <div className="space-y-2">
                                <div className="text-sm text-neutral-500">横向 / 紧凑</div>
                                <IconText icon={<Star />} direction="horizontal" spacing="tight">
                                    横向紧凑
                                </IconText>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-neutral-500">横向 / 正常</div>
                                <IconText icon={<Star />} direction="horizontal" spacing="normal">
                                    横向正常
                                </IconText>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-neutral-500">横向 / 宽松</div>
                                <IconText icon={<Star />} direction="horizontal" spacing="loose">
                                    横向宽松
                                </IconText>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm text-neutral-500">纵向 / 正常</div>
                                <IconText icon={<Heart />} direction="vertical" spacing="normal">
                                    纵向布局
                                </IconText>
                            </div>
                        </div>
                    </section>

                    {/* 5) 动画 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">5) 动效 animation</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            <IconText icon={<Info />} animation="none">none</IconText>
                            <IconText icon={<Info />} animation="fade">fade</IconText>
                            <IconText icon={<Info />} animation="slide">slide</IconText>
                            <IconText icon={<Info />} animation="scale">scale</IconText>
                            <IconText icon={<Info />} animation="bounce">bounce</IconText>
                            <IconText icon={<Info />} animation="pulse">pulse</IconText>
                            <IconText icon={<Info />} animation="glow">glow</IconText>
                            <IconText icon={<Info />} animation="fade" delay={0.2}>
                                带延迟 0.2s
                            </IconText>
                        </div>
                    </section>

                    {/* 6) 可点击 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">6) 可点击 onClick</h2>
                        <IconText
                            icon={<Heart />}
                            variant={liked ? 'success' : 'primary'}
                            animation="scale"
                            onClick={() => setLiked(v => !v)}
                            className="select-none"
                            iconClassName={liked ? 'scale-110' : undefined}
                            textClassName="font-medium"
                        >
                            {liked ? '已点赞' : '点个赞'}
                        </IconText>
                    </section>

                    {/* 7) 高级：组合到卡片/按钮里 */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">7) 组合使用（卡片 / 按钮）</h2>
                        <button
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                            onClick={() => alert('你点击了按钮')}
                        >
                            <IconText
                                icon={<Zap />}
                                variant="primary"
                                animation="fade"
                                className="-ml-1"
                            >
                                开始体验
                            </IconText>
                        </button>

                        <div className="mt-4 rounded-xl border p-4 space-y-2">
                            <IconText icon={<CheckCircle2 />} variant="success" animation="fade">
                                已启用增强模式
                            </IconText>
                            <IconText icon={<Info />} variant="muted" size="sm" animation="slide">
                                你可以在设置中关闭该项
                            </IconText>
                        </div>
                    </section>
                </div>
            ),
            code: ` <IconText icon={<Info />} variant="default">Default</IconText>`
        },
        {
            id: 'MicroInteractions',
            name: 'MicroInteractions',
            icon: '打字特效组件',
            category: 'animations',
            tags: ['基础', '交互', '打字特效'],
            demo: () => (
                <div className="flex flex-wrap gap-2">
                    <div>模拟打字机逐字显示文本的效果，带有闪烁的光标。</div>
                    <Typewriter text="Hello, World!" />

                    // 自定义速度和延迟
                    <Typewriter
                        text="欢迎使用我们的应用！"
                        speed={100}        // 每个字符的显示间隔（毫秒）
                        delay={500}        // 开始前的延迟（毫秒）
                        onComplete={() => console.log('打字完成')}
                        className="text-2xl font-bold"
                    />

                    <div>悬浮卡片效果</div>
                    <HoverCard intensity="high" className="p-6 bg-white rounded-lg shadow-md">
                        <h3>悬浮卡片</h3>
                        <p>鼠标悬浮查看效果</p>
                    </HoverCard>

                    <div>加载骨架屏</div>

                    <Skeleton />

                    <Skeleton lines={3} animated={true} className="p-4" />

                    <div>
                        <div>脉冲效果</div>
                        <Pulse intensity="high" duration={1.5} className="inline-block">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                重要按钮
                            </button>
                        </Pulse>
                    </div>

                    <div>
                        <div>滚动触发动画</div>
                        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
                            <div className="p-6 bg-white rounded-lg">
                                <h2>滚动到此处查看动画</h2>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            ),
            code: `<DragSort items={items} onSort={handleSort} direction="horizontal" gap={20}>
                            {(item, isDragging) => (
                                <div
                                    className={\`p-4 bg-gray-200 rounded-lg }\`}
                                    style={{ cursor: 'move' }}
                                >
                                    {item.data}
                                </div>
                            )}
                        </DragSort>`
        },
        {
            id: 'PageTurner',
            name: 'PageTurner',
            icon: '翻页组件',
            category: 'ui',
            tags: ['基础', '交互', '翻页'],
            demo: () => (
                <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-900 p-4">
                    <h1 className="text-xl text-center text-neutral-800 dark:text-white mb-6">
                        电子书阅读器
                    </h1>

                    {/* PageTurner 组件 */}
                    <PageTurner
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onBookmark={handleBookmark}
                        bookmarks={bookmarks}
                        showPageNumbers={true}
                        showProgress={true}
                        autoSave={true}
                        onAutoSave={handleAutoSave}
                    />

                    {/* 其他内容 */}
                    <div className="mt-6 flex-grow">
                        <h2 className="text-lg text-neutral-800 dark:text-white">第 {currentPage} 页的内容</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            这里是页面内容的展示区域。内容随着页数变化而变化。
                        </p>
                    </div>
                </div>

            ),
            code: `{/* PageTurner 组件 */}
                    <PageTurner
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onBookmark={handleBookmark}
                        bookmarks={bookmarks}
                        showPageNumbers={true}
                        showProgress={true}
                        autoSave={true}
                        onAutoSave={handleAutoSave}
                    />`
        },
    ]

    // 过滤组件
    const filteredComponents = components.filter(component => {
        const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    // 复制代码
    const copyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(code)
            setTimeout(() => setCopiedCode(null), 2000)
        } catch (err) {
            console.error('复制失败:', err)
        }
    }

    // 滚动到指定组件
    const scrollToComponent = (componentId: string) => {
        const element = document.getElementById(componentId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* 移动端菜单按钮 */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* 左侧目录栏 */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">组件库</h2>

                    {/* 搜索框 */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="搜索组件..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* 分类列表 */}
                    <nav className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id)
                                    setSidebarOpen(false)
                                }}
                                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                  ${selectedCategory === category.id
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    {category.icon}
                                    <span className="font-medium">{category.name}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.id === 'all' ? components.length : components.filter(c => c.category === category.id).length}
                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 遮罩层 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 右侧展示区域 */}
            <div className="flex-1 lg:ml-0">
                {/* 顶部工具栏 */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedCategory === 'all' ? '全部组件' : categories.find(c => c.id === selectedCategory)?.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                找到 {filteredComponents.length} 个组件
                            </p>
                        </div>

                        {/* 视图模式切换 */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 组件展示区域 */}
                <div className="p-6">
                    {filteredComponents.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                没有找到匹配的组件
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                尝试调整搜索词或选择其他分类
                            </p>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'
                                : 'space-y-6'
                        }>
                            {filteredComponents.map((component) => (
                                <div
                                    key={component.id}
                                    id={component.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {/* 组件头部 */}
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {component.name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {component.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => copyCode(component.code)}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                {copiedCode === component.code ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        {/* 标签 */}
                                        <div className="flex flex-wrap gap-2">
                                            {component.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                                >
                          {tag}
                        </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 演示区域 */}
                                    <div className="p-6 bg-gray-50 dark:bg-gray-900 max-h-72 overflow-y-auto">
                                        <div className="mb-4">
                                            {component.demo()}
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => scrollToComponent(component.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                查看详情
                                            </button>
                                            <button
                                                onClick={() => copyCode(component.code)}
                                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Code className="w-4 h-4" />
                                                代码
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ComponentLibrary