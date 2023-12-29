// react
import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 1000 * 20,
      useErrorBoundary: true,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
