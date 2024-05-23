import { Helmet } from 'react-helmet-async';
import {TiendaNew} from 'src/sections/tiendas/view';

// ----------------------------------------------------------------------

export default function TiendasPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <TiendaNew />
    </>
  );
}