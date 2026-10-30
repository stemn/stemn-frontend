import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { lazy, Suspense, type ReactNode } from 'react'

// The devtools are only bundled in development builds (the condition is replaced at build time)
const Devtools =
  process.env.NODE_ENV === 'development'
    ? lazy(() => import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })))
    : undefined

export interface IQueryProviderProps {
  client: QueryClient
  children?: ReactNode
}

/** QueryClientProvider plus the TanStack Query devtools in development */
export const QueryProvider = ({ client, children }: IQueryProviderProps) => (
  <QueryClientProvider client={client}>
    {children}
    {Devtools && (
      <Suspense fallback={null}>
        <Devtools buttonPosition="bottom-left" initialIsOpen={false} />
      </Suspense>
    )}
  </QueryClientProvider>
)
