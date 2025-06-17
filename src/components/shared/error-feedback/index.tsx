import { useEffect } from 'react'
import { AlertCircleIcon, XIcon } from 'lucide-react'
import { cn } from '../../../utils/cn'

interface ErrorFeedbackProps {
    isVisible: boolean
    message?: string
    onClose?: () => void
    autoHide?: boolean
    autoHideDelay?: number
}

/**
 * Componente de feedback visual para erros
 * Aparece quando ocorre um erro em operações como salvar ou mover cenas
 */
export function ErrorFeedback({
    isVisible,
    message = 'Ocorreu um erro inesperado',
    onClose,
    autoHide = true,
    autoHideDelay = 3000
}: ErrorFeedbackProps) {
    useEffect(() => {
        if (isVisible && autoHide) {
            const timer = setTimeout(() => {
                onClose?.()
            }, autoHideDelay)

            return () => clearTimeout(timer)
        }
    }, [isVisible, autoHide, autoHideDelay, onClose])

    if (!isVisible) return null

    return (
        <div className={cn(
            'fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-lg shadow-lg transition-all duration-200 max-w-sm',
            'bg-destructive text-destructive-foreground border border-destructive/20',
            'translate-x-0 opacity-100'
        )}>
            <AlertCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-medium mb-1">Erro</p>
                <p className="text-sm leading-relaxed">{message}</p>
            </div>
            {!autoHide && onClose && (
                <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-destructive/20 transition-colors"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    )
} 