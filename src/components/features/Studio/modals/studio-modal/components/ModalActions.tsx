import { cn } from '../../../../../../utils/cn'
import { BUTTON_LABELS } from '../constants'

interface ModalActionsProps {
    onCancel: () => void
    onSave: () => void
    isSaving: boolean
    isCreating: boolean
    hasErrors: boolean
}

export function ModalActions({
    onCancel,
    onSave,
    isSaving,
    isCreating,
    hasErrors
}: ModalActionsProps) {
    return (
        <div className='mt-6 flex justify-end gap-3 pt-4 border-t border-border'>
            <button
                onClick={onCancel}
                disabled={isSaving}
                className={cn(
                    'rounded-lg px-5 py-2.5 text-xs font-medium transition-all duration-200',
                    'text-primary hover:bg-primary/10 hover:text-primary/80',
                    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                    'border border-border hover:border-primary/30'
                )}
            >
                {BUTTON_LABELS.cancel}
            </button>
            <button
                onClick={onSave}
                disabled={isSaving || hasErrors}
                className={cn(
                    'rounded-lg px-5 py-2.5 text-xs font-medium transition-all duration-200',
                    'bg-primary text-accent hover:bg-primary/90 hover:shadow-lg',
                    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                    'transform hover:scale-105 active:scale-95'
                )}
            >
                {isSaving
                    ? BUTTON_LABELS.saving
                    : isCreating
                        ? BUTTON_LABELS.create
                        : BUTTON_LABELS.save
                }
            </button>
        </div>
    )
} 