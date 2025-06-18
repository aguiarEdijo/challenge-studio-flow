import { memo, type ReactNode } from 'react'
import { ErrorBoundary } from '../index'
import type { ErrorBoundaryProps } from '../types'

interface ErrorBoundaryProviderProps extends Omit<ErrorBoundaryProps, 'children'> {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    resetKey?: string | number
}

export const ErrorBoundaryProvider = memo(({
    children,
    fallback,
    onError,
    resetKey,
    ...props
}: ErrorBoundaryProviderProps) => {
    return (
        <ErrorBoundary
            fallback={fallback}
            onError={onError}
            resetKey={resetKey}
            {...props}
        >
            {children}
        </ErrorBoundary>
    )
})

ErrorBoundaryProvider.displayName = 'ErrorBoundaryProvider' 