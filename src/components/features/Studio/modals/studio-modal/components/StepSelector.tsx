import { cn } from '../../../../../../utils/cn'
import { PRODUCTION_STEPS, isLastStep } from '../../../../../../utils/scene-transitions'
import type { StepSelectorProps } from '../types'

export function StepSelector({
    value,
    onChange,
    originalStep,
    isEditMode,
    validNextSteps
}: StepSelectorProps) {
    const isCompleted = originalStep !== undefined && isLastStep(originalStep)

    if (isEditMode && isCompleted) {
        return (
            <div className='space-y-1.5'>
                <label className='text-xs font-medium text-primary/80'>Status</label>
                <div className='mt-1.5 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                        <span className='font-medium'>
                            {originalStep !== undefined ? PRODUCTION_STEPS[originalStep as keyof typeof PRODUCTION_STEPS] : ''} (Finalizado)
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='space-y-1.5'>
            <label className='text-xs font-medium text-primary/80'>Status</label>
            <select
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className={cn(
                    'mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
                    'transition-all duration-200 cursor-pointer',
                    'border-border hover:border-primary/30'
                )}
            >
                {isEditMode ? (
                    <>
                        {/* Mostra a etapa atual */}
                        <option value={originalStep}>
                            {originalStep !== undefined ? PRODUCTION_STEPS[originalStep as keyof typeof PRODUCTION_STEPS] : ''} (Atual)
                        </option>

                        {/* Mostra apenas as próximas etapas válidas baseadas no step original */}
                        {validNextSteps.map((step) => (
                            <option key={step} value={step}>
                                {PRODUCTION_STEPS[step as keyof typeof PRODUCTION_STEPS]}
                            </option>
                        ))}
                    </>
                ) : (
                    // Modo criação: mostra todas as etapas
                    Object.entries(PRODUCTION_STEPS).map(([step, label]) => (
                        <option key={step} value={Number(step)}>
                            {label}
                        </option>
                    ))
                )}
            </select>
        </div>
    )
} 