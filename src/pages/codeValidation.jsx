import { Helmet } from 'react-helmet-async';

import { CodeValidationView } from 'src/sections/forgottenPassword/codeValidation-view'

// ----------------------------------------------------------------------

export default function codeValidationPage() {
  return (
    <>
      <Helmet>
        <title> CodeValidation | Minimal UI </title>
      </Helmet>

      <CodeValidationView/>

    </>
  );
}
