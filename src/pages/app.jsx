import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <AppView />
    <ToastContainer/>
    </>
  );
}
