export type FeedbackType = 'error' | 'info' | 'success'

export interface FeedbackConfig {
    icon: React.ComponentType<{ className?: string }>
    title: string
    styles: {
        container: string
        icon: string
    }
}

export interface TransitionFeedbackProps {
    isVisible: boolean
    message?: string
    type?: FeedbackType
    duration?: number
} 