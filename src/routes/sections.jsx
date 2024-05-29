import { lazy } from 'react';
import {Route, Routes} from 'react-router-dom'

import PrivateRoutes from '../utils/PrivateRoutes'
import { AuthProvider } from '../utils/AuthContext'

export const IndexPage = lazy(() => import('src/pages/app'));
// export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
// export const ProductsPage = lazy(() => import('src/pages/products'));
export const TiendasPage = lazy(() => import('src/pages/tiendas'));
export const TiendaNew = lazy(() => import('src/pages/tienda-nueva'));
export const TiendaVisualizar = lazy(() => import('src/pages/tienda-visualizar'));
export const TiendaEditar = lazy(() => import('src/pages/tienda-editar'));

export const CuponesPage = lazy(() => import('src/pages/cupones'));
export const CuponNew = lazy(() => import('src/pages/cupon-nuevo'));
export const CuponDetalle = lazy(() => import('src/pages/cupon-detalle'));
export const ClientesPage = lazy(() => import('src/pages/clientes'));
export const ClientesDetalle =lazy(() => import('src/pages/clientes-detalle'));
export const CategoriasPage = lazy(() => import('src/pages/categorias'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ForgottenPasswordPage = lazy(() => import('src/pages/forgottenPassword'));
export const CodeValidationPage = lazy(() => import('src/pages/codeValidation'));
export const NuevaContrasenaPage = lazy(() => import('src/pages/nuevaContrasena'));

// ----------------------------------------------------------------------

export default function RouterX() {
  return(

      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/ForgottenPassword" element={<ForgottenPasswordPage/>}/>
          <Route path="/CodeValidation" element={<CodeValidationPage/>}/>
          <Route path="/NewPassword" element={<NuevaContrasenaPage/>}/>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<IndexPage/>}/>
            <Route path="/user" element={<UserPage/>}/>

            <Route path="/cupon" element={<CuponesPage/>}/>
            <Route path="/cupon">
              <Route path="cupon-new" element={<CuponNew/>}/>
              <Route path="detalle/:id" element={<CuponDetalle />} />
            </Route>
            
            <Route path="/categorias" element={<CategoriasPage/>}/>
            <Route path="/clientes" element={<ClientesPage/>}/>
            <Route path="/clientes" >
              <Route path="detalle/:id" element={<ClientesDetalle/>}/>
            </Route>

            <Route path="/tienda" element={<TiendasPage/>}/>
            <Route path="/tienda">
              <Route path="tienda-new" element={<TiendaNew/>}/>
              <Route path="tienda-visualizar/:id" element={<TiendaVisualizar/>}/>
              <Route path="tienda-editar/:id" element={<TiendaEditar/>}/>
            </Route>

            <Route path="*" element={<Page404/>}/>
          </Route>
        </Routes>
      </AuthProvider>

  )
}
