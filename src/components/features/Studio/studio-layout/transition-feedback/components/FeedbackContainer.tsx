import { cn } from '../../../../../../utils/cn'
import type { FeedbackConfig } from '../types'

interface FeedbackContainerProps {
    config: FeedbackConfig
    show: boolean
    children: React.ReactNode
}

export function FeedbackContainer({ config, show, children }: FeedbackContainerProps) {
    return (
        <div className={cn(
            'fixed top-6 right-6 z-50 flex items-center gap-4 p-5 rounded-xl shadow-xl transition-all duration-300 ease-out max-w-md backdrop-blur-sm',
            'border border-opacity-20',
            config.styles.container,
            show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        )}>
            {children}
        </div>
    )
} 