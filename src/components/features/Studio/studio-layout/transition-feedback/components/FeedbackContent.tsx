import type { FeedbackConfig } from '../types'

interface FeedbackContentProps {
    config: FeedbackConfig
    message: string
}

export function FeedbackContent({ config, message }: FeedbackContentProps) {
    return (
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1 leading-tight">
                {config.title}
            </h4>
            <p className="text-sm text-opacity-80 leading-relaxed">
                {message}
            </p>
        </div>
    )
} 