import { Helmet } from 'react-helmet-async';

import { ClienteView } from 'src/sections/clientes/view';

// ----------------------------------------------------------------------

export default function ClientesPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <ClienteView />
    </>
  );
}
