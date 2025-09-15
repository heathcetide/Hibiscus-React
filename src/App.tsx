import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home.tsx';
import Layout from "@/components/Layout/Layout.tsx";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
