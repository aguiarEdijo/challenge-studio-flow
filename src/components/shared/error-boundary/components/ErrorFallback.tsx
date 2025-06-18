import { memo, useEffect } from 'react'
import { ERROR_FALLBACK_CLASSES } from '../constants'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { ErrorBoundaryDisplay } from './ErrorDisplay'
import type { ErrorFallbackProps } from '../types'

export const ErrorFallback = memo(({
    error,
    errorInfo,
    resetError,
    retry,
}: ErrorFallbackProps) => {
    const { errorMessages, shouldShowRetry, shouldShowReset, logError } = useErrorHandler({ error })

    // Log do erro automaticamente
    useEffect(() => {
        logError()
    }, [logError])

    const handleRetry = () => {
        if (retry) {
            retry()
        }
        resetError()
    }

    const handleReset = () => {
        resetError()
        // Opcional: recarregar a página
        // window.location.reload()
    }

    return (
        <div className={ERROR_FALLBACK_CLASSES.CONTAINER}>
            <div className={ERROR_FALLBACK_CLASSES.CONTENT}>
                <ErrorBoundaryDisplay
                    title={errorMessages.title}
                    message={errorMessages.message}
                    details={errorInfo?.componentStack || error.stack}
                    showRetry={shouldShowRetry()}
                    showReset={shouldShowReset()}
                    onRetry={handleRetry}
                    onReset={handleReset}
                />
            </div>
        </div>
    )
})

ErrorFallback.displayName = 'ErrorFallback' 