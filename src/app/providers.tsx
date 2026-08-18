'use client';

import { Provider as ChakraUIProvider } from '@/components/ui/provider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraUIProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="dark">
          {children}
        </ThemeProvider>
      </ChakraUIProvider>
    </ReduxProvider>
  );
}
