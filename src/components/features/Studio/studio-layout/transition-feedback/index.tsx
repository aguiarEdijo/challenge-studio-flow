import { DEFAULT_MESSAGE, DEFAULT_DURATION, FEEDBACK_CONFIGS } from './constants'
import { useTransitionFeedback } from './hooks/useTransitionFeedback'
import { FeedbackContainer, FeedbackContent, FeedbackIcon } from './components'
import type { TransitionFeedbackProps } from './types'

export function TransitionFeedback({
    isVisible,
    message = DEFAULT_MESSAGE,
    type = 'error',
    duration = DEFAULT_DURATION
}: TransitionFeedbackProps) {
    const { show } = useTransitionFeedback({ isVisible, duration })

    if (!show) return null

    const config = FEEDBACK_CONFIGS[type]

    return (
        <FeedbackContainer config={config} show={show}>
            <FeedbackIcon config={config} />
            <FeedbackContent config={config} message={message} />
        </FeedbackContainer>
    )
} 