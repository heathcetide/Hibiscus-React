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

function App() {
    return (
        <ErrorBoundary enableRecovery={true} showDetails={true}>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <LayoutFactory>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/component-library" element={<ComponentLibrary />} />
                            <Route path="/profile" element={<Profile />} />
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
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
