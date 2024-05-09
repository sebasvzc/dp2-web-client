import { Helmet } from 'react-helmet-async';
import { CuponNew} from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export default function CuponesPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <CuponNew />
    </>
  );
}