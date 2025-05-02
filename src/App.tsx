// import './App.css';

import AddPage from './layouts/AddPage';
import HomePage from './layouts/HomePage';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import NotFoundPage from './layouts/NotFoundPage';
import { RecordsProvider } from './contexts/RecordsProvider';
import ViewPage from './layouts/ViewPage';
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/add',
        element: <AddPage operation="add" />,
      },
      {
        path: '/update/:id',
        element: <AddPage operation="update" />,
      },
      {
        path: '/view/:id',
        element: <ViewPage />,
      },
    ],
  },
]);

function AppLayout() {
  return (
    <>
      {/* <HomePage /> */}
      <Outlet />
    </>
  );
}

export const App = () => {
  return (
    <RecordsProvider>
      <RouterProvider router={appRouter} />
    </RecordsProvider>
  );
};

export default App;

