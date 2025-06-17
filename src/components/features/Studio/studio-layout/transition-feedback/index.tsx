import { useEffect, useState } from 'react'
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon } from 'lucide-react'
import { cn } from '../../../../../utils/cn'

interface TransitionFeedbackProps {
    isVisible: boolean
    message?: string
    type?: 'error' | 'info' | 'success'
}

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
            'fixed top-6 right-6 z-50 flex items-center gap-4 p-5 rounded-xl shadow-xl transition-all duration-300 ease-out max-w-md backdrop-blur-sm',
            'border border-opacity-20',
            isError
                ? 'bg-red-50 text-red-900 border-red-200 shadow-red-100/50'
                : isSuccess
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-100/50'
                    : 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100/50',
            show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        )}>
            <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                isError
                    ? 'bg-red-100 text-red-600'
                    : isSuccess
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-blue-100 text-blue-600'
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1 leading-tight">{title}</h4>
                <p className="text-sm text-opacity-80 leading-relaxed">{message}</p>
            </div>
        </div>
    )
} 