import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { isValidTransition, PRODUCTION_STEPS } from '../../../../utils/scene-transitions'
import type { ColumnState } from '../types'

interface UseColumnStateProps {
    id: string
    step: number
}

export const useColumnState = ({ id, step }: UseColumnStateProps) => {
    const { setNodeRef, isOver, active, over } = useDroppable({
        id,
        data: {
            step,
        },
    })

    // Calcula o estado da coluna usando useMemo para evitar re-renders
    const columnState: ColumnState = useMemo(() => {
        if (!over || !active) {
            return { disabled: false, tooltipMessage: '' }
        }

        const fromStep = active?.data.current?.step

        if (typeof fromStep === 'number') {
            // Se está na mesma coluna, permite reordenação
            if (fromStep === step) {
                return { disabled: false, tooltipMessage: 'Solte para reordenar' }
            }

            // Se está mudando de coluna, valida a transição
            const isValid = isValidTransition(fromStep, step)

            if (!isValid) {
                let message = ''
                if (step < fromStep) {
                    message = 'Não é possível voltar etapas. O fluxo só permite avançar.'
                } else if (step > fromStep + 1) {
                    const nextStep = fromStep + 1
                    const nextStepLabel = PRODUCTION_STEPS[nextStep as keyof typeof PRODUCTION_STEPS]
                    message = `Não é possível pular etapas. A próxima etapa válida é "${nextStepLabel}".`
                }

                return { disabled: true, tooltipMessage: message }
            }

            return { disabled: false, tooltipMessage: 'Solte para mover para esta etapa' }
        }

        return { disabled: false, tooltipMessage: '' }
    }, [active, over, step])

    return {
        setNodeRef,
        isOver,
        columnState,
    }
} 