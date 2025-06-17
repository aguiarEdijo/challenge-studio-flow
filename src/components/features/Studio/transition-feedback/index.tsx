import { useEffect, useState } from 'react'
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon } from 'lucide-react'
import { cn } from '../../../../utils/cn'

interface TransitionFeedbackProps {
    isVisible: boolean
    message?: string
    type?: 'error' | 'info' | 'success'
}

/**
 * Componente de feedback visual para transições
 * Aparece quando o usuário tenta fazer uma transição não permitida ou quando uma transição é bem-sucedida
 * Desaparece automaticamente após 1 segundo (erro) ou 2 segundos (sucesso)
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
            const timer = setTimeout(() => setShow(false), type === 'success' ? 2000 : 1000)
            return () => clearTimeout(timer)
        } else {
            setShow(false)
        }
    }, [isVisible, type])

    if (!show) return null

    const isError = type === 'error'
    const isSuccess = type === 'success'
    const isInfo = type === 'info'

    let Icon = InfoIcon
    let title = 'Informação'

    if (isError) {
        Icon = AlertTriangleIcon
        title = 'Movimento não permitido'
    } else if (isSuccess) {
        Icon = CheckCircleIcon
        title = 'Sucesso!'
    }

    return (
        <div className={cn(
            'fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-lg shadow-lg transition-all duration-200 max-w-sm',
            isError
                ? 'bg-destructive text-destructive-foreground border border-destructive/20'
                : isSuccess
                    ? 'bg-green-500 text-white border border-green-500/20'
                    : 'bg-blue-500 text-white border border-blue-500/20',
            show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}>
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-medium mb-1">{title}</p>
                <p className="text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    )
} 