import { memo } from 'react'
import { ERROR_DISPLAY_CLASSES } from '../constants'

interface ErrorIconProps {
    className?: string
}

export const ErrorIcon = memo(({ className }: ErrorIconProps) => {
    return (
        <svg
            className={className || ERROR_DISPLAY_CLASSES.ICON}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
        </svg>
    )
})

ErrorIcon.displayName = 'ErrorIcon' 