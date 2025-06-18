import { useEffect, useState } from 'react'

interface UseTransitionFeedbackProps {
    isVisible: boolean
    duration?: number
}

export function useTransitionFeedback({ isVisible, duration = 2000 }: UseTransitionFeedbackProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShow(true)
            const timer = setTimeout(() => setShow(false), duration)
            return () => clearTimeout(timer)
        } else {
            setShow(false)
        }
    }, [isVisible, duration])

    return { show }
} 