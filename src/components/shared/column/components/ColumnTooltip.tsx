import { memo } from 'react'
import { TOOLTIP_CLASSES } from '../constants'
import type { ColumnTooltipProps } from '../types'

export const ColumnTooltip = memo(({ message, isVisible }: ColumnTooltipProps) => {
    if (!isVisible || !message) {
        return null
    }

    return (
        <div className={TOOLTIP_CLASSES.BASE}>
            <span className={TOOLTIP_CLASSES.MESSAGE}>
                {message}
            </span>
        </div>
    )
})

ColumnTooltip.displayName = 'ColumnTooltip' 