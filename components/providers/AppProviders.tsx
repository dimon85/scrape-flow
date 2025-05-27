"use client";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import NextTopLoader from 'nextjs-toploader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const NextThemesProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

export function AppProviders({ children } : { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </NextThemesProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}