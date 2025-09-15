import { ReactNode } from 'react'
import { useUIStore } from '@/stores/uiStore'
import Layout from './layouts/Layout.tsx'
import TopNavLayout from './layouts/TopNavLayout'
import GridLayout from './layouts/GridLayout'
import CardLayout from './layouts/CardLayout'
import MinimalLayout from './layouts/MinimalLayout'
import DashboardLayout from './layouts/DashboardLayout'
import MagazineLayout from './layouts/MagazineLayout'
import SplitLayout from './layouts/SplitLayout'
import MasonryLayout from './layouts/MasonryLayout'
import KanbanLayout from './layouts/KanbanLayout'
import TimelineLayout from './layouts/TimelineLayout'
import GalleryLayout from './layouts/GalleryLayout'
import BlogLayout from './layouts/BlogLayout'
import PortfolioLayout from './layouts/PortfolioLayout'
import EcommerceLayout from './layouts/EcommerceLayout'
import AdminLayout from './layouts/AdminLayout'
import { 
  GridLayoutProps, 
  BlogLayoutProps, 
  GalleryLayoutProps, 
  PortfolioLayoutProps, 
  EcommerceLayoutProps, 
  KanbanLayoutProps, 
  TimelineLayoutProps, 
  MasonryLayoutProps, 
  DashboardLayoutProps, 
  AdminLayoutProps, 
  MagazineLayoutProps, 
  SplitLayoutProps, 
  CardLayoutProps, 
  MinimalLayoutProps, 
  TopNavLayoutProps 
} from '@/types/layout'

interface LayoutFactoryProps {
  children: ReactNode
  // 布局特定的props
  gridProps?: Partial<GridLayoutProps>
  blogProps?: Partial<BlogLayoutProps>
  galleryProps?: Partial<GalleryLayoutProps>
  portfolioProps?: Partial<PortfolioLayoutProps>
  ecommerceProps?: Partial<EcommerceLayoutProps>
  kanbanProps?: Partial<KanbanLayoutProps>
  timelineProps?: Partial<TimelineLayoutProps>
  masonryProps?: Partial<MasonryLayoutProps>
  dashboardProps?: Partial<DashboardLayoutProps>
  adminProps?: Partial<AdminLayoutProps>
  magazineProps?: Partial<MagazineLayoutProps>
  splitProps?: Partial<SplitLayoutProps>
  cardProps?: Partial<CardLayoutProps>
  minimalProps?: Partial<MinimalLayoutProps>
  topNavProps?: Partial<TopNavLayoutProps>
}

const LayoutFactory = ({ 
  children, 
  gridProps,
  blogProps,
  galleryProps,
  portfolioProps,
  ecommerceProps,
  kanbanProps,
  timelineProps,
  masonryProps,
  dashboardProps,
  adminProps,
  magazineProps,
  splitProps,
  cardProps,
  minimalProps,
  topNavProps
}: LayoutFactoryProps) => {
  const { layoutType } = useUIStore()

  const renderLayout = () => {
    switch (layoutType) {
      case 'sidebar':
        return <Layout>{children}</Layout>
      case 'top-nav':
        return <TopNavLayout {...topNavProps}>{children}</TopNavLayout>
      case 'grid':
        return <GridLayout {...gridProps}>{children}</GridLayout>
      case 'card':
        return <CardLayout {...cardProps}>{children}</CardLayout>
      case 'minimal':
        return <MinimalLayout {...minimalProps}>{children}</MinimalLayout>
      case 'dashboard':
        return <DashboardLayout {...dashboardProps}>{children}</DashboardLayout>
      case 'magazine':
        return <MagazineLayout {...magazineProps}>{children}</MagazineLayout>
      case 'split':
        return <SplitLayout {...splitProps}>{children}</SplitLayout>
      case 'masonry':
        return <MasonryLayout {...masonryProps}>{children}</MasonryLayout>
      case 'kanban':
        return <KanbanLayout {...kanbanProps}>{children}</KanbanLayout>
      case 'timeline':
        return <TimelineLayout {...timelineProps}>{children}</TimelineLayout>
      case 'gallery':
        return <GalleryLayout {...galleryProps}>{children}</GalleryLayout>
      case 'blog':
        return <BlogLayout {...blogProps}>{children}</BlogLayout>
      case 'portfolio':
        return <PortfolioLayout {...portfolioProps}>{children}</PortfolioLayout>
      case 'ecommerce':
        return <EcommerceLayout {...ecommerceProps}>{children}</EcommerceLayout>
      case 'admin':
        return <AdminLayout {...adminProps}>{children}</AdminLayout>
      case 'mobile-first':
        return <TopNavLayout {...topNavProps}>{children}</TopNavLayout> // 使用顶部导航作为移动优先布局
      case 'fullscreen':
        return <MinimalLayout {...minimalProps}>{children}</MinimalLayout> // 使用极简布局作为全屏布局
      case 'floating':
        return <CardLayout {...cardProps}>{children}</CardLayout> // 使用卡片布局作为浮动布局
      default:
        return <Layout>{children}</Layout>
    }
  }

  return renderLayout()
}

export default LayoutFactory

