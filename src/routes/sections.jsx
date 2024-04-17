import { lazy, Suspense } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from '../utils/PrivateRoutes'
import { AuthProvider } from '../utils/AuthContext'



export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function RouterX() {
  return(

      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<IndexPage/>}/>
            <Route path="/user" element={<UserPage/>}/>
            <Route path="*" element={<Page404/>}/>
          </Route>
        </Routes>
      </AuthProvider>

  )
}
