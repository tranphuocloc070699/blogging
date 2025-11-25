'use client';

import {siteConfig} from '@/config/site.config';
import {ThemeProvider as NextThemeProvider} from 'next-themes';

export default function ThemeProvider({children}: React.PropsWithChildren<{}>) {
  return (
      <NextThemeProvider
          attribute={"class"}
          enableSystem
          defaultTheme={String(siteConfig.mode)}
      >
        {children}
      </NextThemeProvider>
  );
}

