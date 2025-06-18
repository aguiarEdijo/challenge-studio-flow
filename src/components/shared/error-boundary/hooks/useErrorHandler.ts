import { useCallback, useMemo } from 'react'
import { ERROR_TYPES, ERROR_MESSAGES } from '../constants'

interface UseErrorHandlerProps {
    error: Error
}

export const useErrorHandler = ({ error }: UseErrorHandlerProps) => {
    // Categoriza o tipo de erro
    const errorType = useMemo(() => {
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            return ERROR_TYPES.NETWORK
        }
        if (error.name === 'ValidationError' || error.message.includes('validation')) {
            return ERROR_TYPES.VALIDATION
        }
        if (error.name === 'PermissionError' || error.message.includes('permission')) {
            return ERROR_TYPES.PERMISSION
        }
        if (error.name === 'NotFoundError' || error.message.includes('not found')) {
            return ERROR_TYPES.NOT_FOUND
        }
        return ERROR_TYPES.UNKNOWN
    }, [error])

    // Obtém mensagens apropriadas baseadas no tipo de erro
    const errorMessages = useMemo(() => {
        switch (errorType) {
            case ERROR_TYPES.NETWORK:
                return {
                    title: ERROR_MESSAGES.NETWORK_ERROR,
                    message: ERROR_MESSAGES.NETWORK_MESSAGE,
                }
            case ERROR_TYPES.VALIDATION:
                return {
                    title: ERROR_MESSAGES.VALIDATION_ERROR,
                    message: ERROR_MESSAGES.VALIDATION_MESSAGE,
                }
            case ERROR_TYPES.PERMISSION:
                return {
                    title: ERROR_MESSAGES.PERMISSION_ERROR,
                    message: ERROR_MESSAGES.PERMISSION_MESSAGE,
                }
            case ERROR_TYPES.NOT_FOUND:
                return {
                    title: ERROR_MESSAGES.NOT_FOUND_ERROR,
                    message: ERROR_MESSAGES.NOT_FOUND_MESSAGE,
                }
            default:
                return {
                    title: ERROR_MESSAGES.DEFAULT_TITLE,
                    message: ERROR_MESSAGES.DEFAULT_MESSAGE,
                }
        }
    }, [errorType])

    // Determina se deve mostrar opções de retry
    const shouldShowRetry = useCallback(() => {
        return errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.UNKNOWN
    }, [errorType])

    // Determina se deve mostrar opções de reset
    const shouldShowReset = useCallback(() => {
        return errorType !== ERROR_TYPES.PERMISSION
    }, [errorType])

    // Log do erro para debugging
    const logError = useCallback(() => {
        console.error('Error Boundary caught an error:', {
            error: error.message,
            stack: error.stack,
            type: errorType,
            timestamp: new Date().toISOString(),
        })
    }, [error, errorType])

    return {
        errorType,
        errorMessages,
        shouldShowRetry,
        shouldShowReset,
        logError,
    }
} 