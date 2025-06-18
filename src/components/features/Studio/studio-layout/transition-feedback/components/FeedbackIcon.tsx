import { cn } from '../../../../../../utils/cn'
import type { FeedbackConfig } from '../types'

interface FeedbackIconProps {
    config: FeedbackConfig
}

export function FeedbackIcon({ config }: FeedbackIconProps) {
    const Icon = config.icon

    return (
        <div className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
            config.styles.icon
        )}>
            <Icon className="h-5 w-5" />
        </div>
    )
} 