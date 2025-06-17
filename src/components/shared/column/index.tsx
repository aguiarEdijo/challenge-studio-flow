import { type ReactNode, useMemo, memo } from 'react';

import { useDroppable } from '@dnd-kit/core';

import { cn } from '../../../utils/cn';
import { isValidTransition, PRODUCTION_STEPS } from '../../../utils/scene-transitions';

interface ColumnProps {
  id: string;
  step: number;
  label: string;
  count?: number;
  description?: string;
  children?: ReactNode;
}

/**
 * Componente de coluna otimizado para evitar re-renders durante drag and drop
 */
export const Column = memo(({ id, step, label, count, description, children }: ColumnProps) => {
  const { setNodeRef, isOver, active, over } = useDroppable({
    id,
    data: {
      step,
    },
  });

  // Calcula o estado da coluna usando useMemo para evitar re-renders
  const columnState = useMemo(() => {
    if (!over || !active) {
      return { disabled: false, tooltipMessage: '' };
    }

    const fromStep = active?.data.current?.step;

    if (typeof fromStep === 'number') {
      const isValid = isValidTransition(fromStep, step);

      if (!isValid) {
        let message = '';
        if (fromStep === step) {
          message = 'A cena já está nesta etapa';
        } else if (step < fromStep) {
          message = 'Não é possível voltar etapas. O fluxo só permite avançar.';
        } else if (step > fromStep + 1) {
          const nextStep = fromStep + 1;
          const nextStepLabel = PRODUCTION_STEPS[nextStep as keyof typeof PRODUCTION_STEPS];
          message = `Não é possível pular etapas. A próxima etapa válida é "${nextStepLabel}".`;
        }

        return { disabled: true, tooltipMessage: message };
      }
    }

    return { disabled: false, tooltipMessage: '' };
  }, [active, over, step]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-secondary rounded-lg border border-border w-72 min-w-[16rem] max-w-xs h-full relative',
        // Estados visuais sem transições para evitar piscadas
        isOver && !columnState.disabled && 'border-primary bg-primary/5 shadow-lg',
        columnState.disabled && 'opacity-50 border-dashed border-muted cursor-not-allowed',
        !isOver && !columnState.disabled && 'hover:border-border/80'
      )}
      title={columnState.tooltipMessage}
    >
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-foreground'>{label}</span>
          {typeof count === 'number' && (
            <span className='bg-muted text-xs rounded-full px-2 py-0.5 text-muted-foreground font-semibold'>
              {count}
            </span>
          )}
        </div>
        {columnState.disabled && (
          <div className='text-xs text-muted-foreground'>
            Não disponível
          </div>
        )}
      </div>
      {description && <div className='px-4 py-1 text-xs text-muted-foreground'>{description}</div>}
      <div className='column-scroll flex-1 overflow-y-auto px-2 py-2 space-y-2'>{children}</div>
    </div>
  );
});

Column.displayName = 'Column';
