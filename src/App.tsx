import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home.tsx';
import Layout from "@/components/Layout/Layout.tsx";
import PWAInstaller from "@/components/PWA/PWAInstaller.tsx";
import ComponentLibrary from "@/pages/ComponentLibrary.tsx";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";

function App() {
    return (
        <ErrorBoundary enableRecovery={true} showDetails={true}>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/component-library" element={<ComponentLibrary />} />
                        </Routes>
                    </Layout>
                    {/* PWA 安装提示 */}
                    <PWAInstaller
                        showOnLoad={true}
                        delay={5000}
                        position="bottom-right"
                    />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
