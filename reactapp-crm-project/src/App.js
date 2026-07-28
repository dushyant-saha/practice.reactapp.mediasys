//React Router imports
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
//Component imports
import {ComponentPractice} from './pages/Components';
import {HookPractice} from './pages/Hooks';
import RootLayout from './pages/RootLayout';
import {Home} from './pages/Home';
import {About} from './pages/About';
import Login from './pages/Login';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />, // A layout wrapper (more on this below)
        children: [
            { path: '/', element: <Home/> },
            { path: '/signin', element: <Login/> },
            { path: '/about', element: <About/> },
            { path: '/practice-components', element: <ComponentPractice/> },
            { path: '/practice-hooks', element: <HookPractice/> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;