import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import Loader from './components/common/Loader';
import Login from './pages/auth/Login';
import { getAllRoutes } from './config/routes';
import Dashboard from './pages/dashboard/Dashboard';
import RequireAuth from './components/auth/RequireAuth';



function AppContent() {
  
  const token = localStorage.getItem('token');
  const isLoading = useSelector((state) => state.loader.isLoading);
  const user=useSelector((state) => state.auth.user);
  const routes = getAllRoutes();

  return (
    <>
      {isLoading && <Loader fullScreen />}
      <Router>
        <Routes>
          <Route path="/login" element={token ? <Layout><Dashboard /></Layout> : <Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout user={user}>
                  <Routes>
                    {routes.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={<Element />}
                      />
                    ))}
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
