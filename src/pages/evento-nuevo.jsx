import { Helmet } from 'react-helmet-async';
import { EventoNew } from 'src/routes/sections/eventos/view';

// ----------------------------------------------------------------------

export default function EventosPage() {
  return (
    <>
      <Helmet>
        <title> Nuevo Cupon | Plaza San Miguel </title>
      </Helmet>

      <EventoNew />
    </>
  );
}