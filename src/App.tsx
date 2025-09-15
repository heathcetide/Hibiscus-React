import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home.tsx';
import Layout from "@/components/Layout/Layout.tsx";
import PWAInstaller from "@/components/PWA/PWAInstaller.tsx";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
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
    );
}

export default App;
