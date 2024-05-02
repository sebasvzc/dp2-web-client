import { Helmet } from 'react-helmet-async';

import { ForgottenPasswordView } from 'src/sections/forgottenPassword/forgottenPassword-view'

// ----------------------------------------------------------------------

export default function ForgottenPasswordPage() {
  return (
    <>
      <Helmet>
        <title> ForgottenPassword | Minimal UI </title>
      </Helmet>

      <ForgottenPasswordView/>

    </>
  );
}
