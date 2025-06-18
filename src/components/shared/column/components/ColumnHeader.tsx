import { memo } from 'react'
import { HEADER_CLASSES } from '../constants'
import type { ColumnHeaderProps } from '../types'

export const ColumnHeader = memo(({ label, count, onAddScene }: ColumnHeaderProps) => {
    const handleAddScene = () => {
        if (onAddScene) {
            onAddScene()
        }
    }

    return (
        <div className={HEADER_CLASSES.BASE}>
            <div className="flex items-center gap-2">
                <span className={HEADER_CLASSES.LABEL}>{label}</span>
                {count !== undefined && (
                    <span className={HEADER_CLASSES.COUNT}>
                        {count}
                    </span>
                )}
            </div>
            {onAddScene && (
                <button
                    className={HEADER_CLASSES.ADD_BUTTON}
                    onClick={handleAddScene}
                    title="Adicionar nova cena"
                >
                    +
                </button>
            )}
        </div>
    )
})

ColumnHeader.displayName = 'ColumnHeader' 