# 微交互组件库 (MicroInteractions)

这个组件库提供了一系列精美的微交互效果，可以大大提升用户体验。所有组件都基于 Framer Motion 构建，支持流畅的动画效果。

## 组件列表

### 1. Typewriter - 打字机效果

模拟打字机逐字显示文本的效果，带有闪烁的光标。

```tsx
import { Typewriter } from '@/components/UX/MicroInteractions'

// 基础用法
<Typewriter text="Hello, World!" />

// 自定义速度和延迟
<Typewriter 
  text="欢迎使用我们的应用！" 
  speed={100}        // 每个字符的显示间隔（毫秒）
  delay={500}        // 开始前的延迟（毫秒）
  onComplete={() => console.log('打字完成')}
  className="text-2xl font-bold"
/>
```

**Props:**
- `text: string` - 要显示的文本
- `speed?: number` - 打字速度，默认 50ms
- `delay?: number` - 开始延迟，默认 0ms
- `className?: string` - 自定义样式类
- `onComplete?: () => void` - 完成回调

### 2. HoverCard - 悬浮卡片效果

鼠标悬浮时的卡片提升效果，支持不同强度。

```tsx
import { HoverCard } from '@/components/UX/MicroInteractions'

<HoverCard intensity="high" className="p-6 bg-white rounded-lg shadow-md">
  <h3>悬浮卡片</h3>
  <p>鼠标悬浮查看效果</p>
</HoverCard>
```

**Props:**
- `children: React.ReactNode` - 卡片内容
- `className?: string` - 自定义样式类
- `intensity?: 'low' | 'medium' | 'high'` - 悬浮强度，默认 'medium'

### 3. Skeleton - 加载骨架屏

用于内容加载时的占位效果。

```tsx
import { Skeleton } from '@/components/UX/MicroInteractions'

// 单行骨架
<Skeleton />

// 多行骨架
<Skeleton lines={3} animated={true} className="p-4" />
```

**Props:**
- `className?: string` - 自定义样式类
- `lines?: number` - 骨架行数，默认 1
- `animated?: boolean` - 是否显示动画，默认 true

### 4. ProgressIndicator - 进度指示器

带动画的进度条组件。

```tsx
import { ProgressIndicator } from '@/components/UX/MicroInteractions'

<ProgressIndicator 
  current={75} 
  total={100} 
  showPercentage={true}
  animated={true}
  className="mb-4"
/>
```

**Props:**
- `current: number` - 当前进度值
- `total: number` - 总进度值
- `className?: string` - 自定义样式类
- `showPercentage?: boolean` - 是否显示百分比，默认 true
- `animated?: boolean` - 是否显示动画，默认 true

### 5. Pulse - 脉冲效果

持续的缩放脉冲动画。

```tsx
import { Pulse } from '@/components/UX/MicroInteractions'

<Pulse intensity="high" duration={1.5} className="inline-block">
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    重要按钮
  </button>
</Pulse>
```

**Props:**
- `children: React.ReactNode` - 要应用脉冲效果的内容
- `className?: string` - 自定义样式类
- `intensity?: 'low' | 'medium' | 'high'` - 脉冲强度，默认 'medium'
- `duration?: number` - 动画持续时间（秒），默认 2

### 6. ScrollReveal - 滚动触发动画

当元素进入视口时触发的动画效果。

```tsx
import { ScrollReveal } from '@/components/UX/MicroInteractions'

<ScrollReveal direction="up" delay={0.2} duration={0.8}>
  <div className="p-6 bg-white rounded-lg">
    <h2>滚动到此处查看动画</h2>
  </div>
</ScrollReveal>
```

**Props:**
- `children: React.ReactNode` - 要动画的内容
- `className?: string` - 自定义样式类
- `direction?: 'up' | 'down' | 'left' | 'right'` - 动画方向，默认 'up'
- `delay?: number` - 动画延迟（秒），默认 0
- `duration?: number` - 动画持续时间（秒），默认 0.6

### 7. Magnetic - 磁吸效果

鼠标移动时元素跟随鼠标的磁吸效果。

```tsx
import { Magnetic } from '@/components/UX/MicroInteractions'

<Magnetic strength={0.5} className="inline-block">
  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
    磁吸按钮
  </button>
</Magnetic>
```

**Props:**
- `children: React.ReactNode` - 要应用磁吸效果的内容
- `className?: string` - 自定义样式类
- `strength?: number` - 磁吸强度，默认 0.3

### 8. Ripple - 涟漪效果

点击时产生涟漪扩散效果。

```tsx
import { Ripple } from '@/components/UX/MicroInteractions'

<Ripple color="rgba(59, 130, 246, 0.6)" duration={800}>
  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
    点击查看涟漪效果
  </button>
</Ripple>
```

**Props:**
- `children: React.ReactNode` - 要应用涟漪效果的内容
- `className?: string` - 自定义样式类
- `color?: string` - 涟漪颜色，默认 'rgba(255, 255, 255, 0.6)'
- `duration?: number` - 涟漪持续时间（毫秒），默认 600

### 9. ParticleBackground - 粒子背景

动态的粒子背景效果。

```tsx
import { ParticleBackground } from '@/components/UX/MicroInteractions'

<div className="relative h-screen bg-gray-900">
  <ParticleBackground 
    particleCount={100}
    color="#3b82f6"
    speed={2}
    className="opacity-30"
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <h1 className="text-white text-4xl">粒子背景</h1>
  </div>
</div>
```

**Props:**
- `className?: string` - 自定义样式类
- `particleCount?: number` - 粒子数量，默认 50
- `color?: string` - 粒子颜色，默认 '#3b82f6'
- `speed?: number` - 粒子移动速度，默认 1

## 组合使用示例

```tsx
import { 
  Typewriter, 
  HoverCard, 
  ScrollReveal, 
  Magnetic,
  Ripple 
} from '@/components/UX/MicroInteractions'

function HeroSection() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ScrollReveal direction="up" delay={0.3}>
        <HoverCard intensity="high" className="text-center p-8">
          <Magnetic strength={0.2}>
            <Ripple color="rgba(59, 130, 246, 0.4)">
              <div className="space-y-6">
                <Typewriter 
                  text="欢迎来到我们的应用"
                  speed={80}
                  delay={500}
                  className="text-4xl font-bold text-gray-800"
                />
                <p className="text-gray-600">
                  体验最流畅的微交互效果
                </p>
                <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  开始体验
                </button>
              </div>
            </Ripple>
          </Magnetic>
        </HoverCard>
      </ScrollReveal>
    </div>
  )
}
```

## 性能优化建议

1. **合理使用动画**: 避免在移动设备上使用过多复杂动画
2. **控制粒子数量**: `ParticleBackground` 的粒子数量不要超过 100
3. **使用 `will-change`**: 对于频繁动画的元素，添加 `will-change: transform`
4. **避免重复渲染**: 使用 `useMemo` 和 `useCallback` 优化性能

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

所有组件都基于现代浏览器 API，建议在目标浏览器中测试效果。

## 注意事项

1. 确保已安装 `framer-motion` 依赖
2. 某些动画效果在低性能设备上可能表现不佳
3. 粒子背景会消耗较多 CPU 资源，建议在不需要时移除
4. 磁吸效果在触摸设备上不会生效
