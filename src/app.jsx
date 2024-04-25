/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';


import ThemeProvider from 'src/theme';
import RouterX from 'src/routes/sections';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <RouterX />
    </ThemeProvider>
  );
}
