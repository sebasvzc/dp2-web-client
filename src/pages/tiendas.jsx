import { Helmet } from 'react-helmet-async';

import {TiendasView  } from 'src/sections/tiendas/view';

// ----------------------------------------------------------------------

export default function TiendasPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <TiendasView />
    </>
  );
}
