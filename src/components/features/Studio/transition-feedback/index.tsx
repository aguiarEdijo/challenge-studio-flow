import { useEffect, useState } from 'react'
import { AlertTriangleIcon, InfoIcon } from 'lucide-react'
import { cn } from '../../../../utils/cn'

interface TransitionFeedbackProps {
    isVisible: boolean
    message?: string
    type?: 'error' | 'info'
}

/**
 * Componente de feedback visual para transições inválidas
 * Aparece quando o usuário tenta fazer uma transição não permitida
 * Desaparece automaticamente após 1 segundo
 */
export function TransitionFeedback({
    isVisible,
    message = 'Só é possível avançar uma etapa por vez',
    type = 'error'
}: TransitionFeedbackProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShow(true)
            const timer = setTimeout(() => setShow(false), 1000)
            return () => clearTimeout(timer)
        } else {
            setShow(false)
        }
    }, [isVisible])

    if (!show) return null

    const isError = type === 'error'
    const Icon = isError ? AlertTriangleIcon : InfoIcon

    return (
        <div className={cn(
            'fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-lg shadow-lg transition-all duration-200 max-w-sm',
            isError
                ? 'bg-destructive text-destructive-foreground border border-destructive/20'
                : 'bg-blue-500 text-white border border-blue-500/20',
            show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}>
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                    {isError ? 'Movimento não permitido' : 'Informação'}
                </p>
                <p className="text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    )
} 