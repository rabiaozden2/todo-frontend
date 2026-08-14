'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ChakraProvider>
    </Provider>
  );
}
