import { Helmet } from 'react-helmet-async';
import { EventoView } from 'src/sections/eventos/view';

// ----------------------------------------------------------------------

export default function EventosPage() {
  return (
    <>
      <Helmet>
        <title> Cupon | Plaza San Miguel </title>
      </Helmet>

      <EventoView />
    </>
  );
}