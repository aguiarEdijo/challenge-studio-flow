import { type ReactNode } from 'react'

export interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    resetKey?: string | number
}

export interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

export interface ErrorFallbackProps {
    error: Error
    errorInfo?: React.ErrorInfo
    resetError: () => void
    retry?: () => void
}

export interface ErrorDisplayProps {
    title?: string
    message?: string
    details?: string
    showRetry?: boolean
    showReset?: boolean
    onRetry?: () => void
    onReset?: () => void
}

export interface ErrorBoundaryContextValue {
    error: Error | null
    resetError: () => void
    setError: (error: Error) => void
} 