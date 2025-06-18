import { AlertTriangleIcon, InfoIcon, CheckCircleIcon } from 'lucide-react'
import type { FeedbackConfig } from './types'

export const DEFAULT_MESSAGE = 'Só é possível avançar uma etapa por vez'
export const DEFAULT_DURATION = 2000

export const FEEDBACK_CONFIGS: Record<string, FeedbackConfig> = {
    error: {
        icon: AlertTriangleIcon,
        title: 'Movimento não permitido',
        styles: {
            container: 'bg-red-50 text-red-900 border-red-200 shadow-red-100/50',
            icon: 'bg-red-100 text-red-600'
        }
    },
    success: {
        icon: CheckCircleIcon,
        title: 'Sucesso!',
        styles: {
            container: 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-100/50',
            icon: 'bg-emerald-100 text-emerald-600'
        }
    },
    info: {
        icon: InfoIcon,
        title: 'Informação',
        styles: {
            container: 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100/50',
            icon: 'bg-blue-100 text-blue-600'
        }
    }
} 