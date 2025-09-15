// Home.tsx
import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Hello, World!
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    欢迎使用Hibiscus-React
                </p>
            </div>
        </div>
    );
};

export default Home;
