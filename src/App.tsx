import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home.tsx';
import PWAInstaller from "@/components/PWA/PWAInstaller.tsx";
import ComponentLibrary from "@/pages/ComponentLibrary.tsx";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import DevErrorHandler from "@/components/Dev/DevErrorHandler.tsx";
import LayoutFactory from "@/components/Layout/LayoutFactory.tsx";
import NotFound from "@/pages/NotFound.tsx";
import AudioController from "@/components/UI/AudioController.tsx";
import Profile from "@/pages/Profile.tsx";
import NotificationContainer from "@/components/UI/NotificationContainer.tsx";
import {lazy} from "react";
import AnimationShowcase from "@/pages/AnimationShowcase.tsx";
import About from "@/pages/About.tsx";
import AdvancedPerformanceMonitor from "@/components/Performance/AdvancedPerformanceMonitor.tsx";

// 懒加载非关键页面
const LazyAdvancedShowcase = lazy(() => import('./pages/AdvancedShowcase'))

function App() {
    return (
        <ErrorBoundary enableRecovery={true} showDetails={true}>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <LayoutFactory>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/component-library" element={<ComponentLibrary />} />
                            <Route path="/advanced-showcase" element={<LazyAdvancedShowcase />} />
                            <Route path="/animation-showcase" element={<AnimationShowcase />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/about" element={<About />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </LayoutFactory>

                    {/* PWA 安装提示 */}
                    <PWAInstaller
                        showOnLoad={true}
                        delay={5000}
                        position="bottom-right"
                    />

                    {/* 开发环境错误处理 */}
                    <DevErrorHandler />

                    {/* 音频控制器 */}
                    <AudioController position="bottom-left" />

                    {/* 自定义通知系统 */}
                    <NotificationContainer />

                    {/* 性能监控 */}
                    <AdvancedPerformanceMonitor
                        showMetrics={true}
                        showMemory={true}
                        showNetwork={true}
                        autoHide={true}
                        hideDelay={10000}
                    />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
