import { memo } from 'react'
import { ERROR_DISPLAY_CLASSES } from '../constants'
import { ErrorIcon } from './ErrorIcon'
import type { ErrorDisplayProps } from '../types'

export const ErrorBoundaryDisplay = memo(({
    title = 'Algo deu errado',
    message = 'Ocorreu um erro inesperado.',
    details,
    showRetry = true,
    showReset = true,
    onRetry,
    onReset,
}: ErrorDisplayProps) => {
    return (
        <div className={ERROR_DISPLAY_CLASSES.CONTAINER}>
            <ErrorIcon />

            <div>
                <h3 className={ERROR_DISPLAY_CLASSES.TITLE}>
                    {title}
                </h3>
                <p className={ERROR_DISPLAY_CLASSES.MESSAGE}>
                    {message}
                </p>
            </div>

            {details && (
                <details className="w-full">
                    <summary className="cursor-pointer text-xs text-muted-foreground mb-2">
                        Detalhes do erro
                    </summary>
                    <pre className={ERROR_DISPLAY_CLASSES.DETAILS}>
                        {details}
                    </pre>
                </details>
            )}

            {(showRetry || showReset) && (
                <div className={ERROR_DISPLAY_CLASSES.ACTIONS}>
                    {showRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className={ERROR_DISPLAY_CLASSES.BUTTON_PRIMARY}
                        >
                            Tentar Novamente
                        </button>
                    )}

                    {showReset && onReset && (
                        <button
                            onClick={onReset}
                            className={ERROR_DISPLAY_CLASSES.BUTTON_SECONDARY}
                        >
                            Recarregar
                        </button>
                    )}
                </div>
            )}
        </div>
    )
})

ErrorBoundaryDisplay.displayName = 'ErrorBoundaryDisplay' 