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
  onAddScene?: (step: number) => void;
}

/**
 * Componente de coluna otimizado para evitar re-renders durante drag and drop
 * Suporta reordenação dentro da coluna e transições entre colunas
 * Inclui botão para adicionar novas cenas
 */
export const Column = memo(({ id, step, label, count, description, children, onAddScene }: ColumnProps) => {
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
      // Se está na mesma coluna, permite reordenação
      if (fromStep === step) {
        return { disabled: false, tooltipMessage: 'Solte para reordenar' };
      }

      // Se está mudando de coluna, valida a transição
      const isValid = isValidTransition(fromStep, step);

      if (!isValid) {
        let message = '';
        if (step < fromStep) {
          message = 'Não é possível voltar etapas. O fluxo só permite avançar.';
        } else if (step > fromStep + 1) {
          const nextStep = fromStep + 1;
          const nextStepLabel = PRODUCTION_STEPS[nextStep as keyof typeof PRODUCTION_STEPS];
          message = `Não é possível pular etapas. A próxima etapa válida é "${nextStepLabel}".`;
        }

        return { disabled: true, tooltipMessage: message };
      }

      return { disabled: false, tooltipMessage: 'Solte para mover para esta etapa' };
    }

    return { disabled: false, tooltipMessage: '' };
  }, [active, over, step]);

  const handleAddScene = () => {
    if (onAddScene) {
      onAddScene(step);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-secondary rounded-lg min-w-[15rem] max-w-[15rem] flex-1 relative overflow-hidden',
        'max-h-[calc(100vh-11rem)]', // Altura máxima com margem para header/nav
        isOver && !columnState.disabled && 'ring-2 ring-primary/50',
        columnState.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className='flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/95 backdrop-blur-sm sticky top-0 z-10 max-h-[calc(100vh-11rem)] mb-2'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-primary'>{label}</span>
          {count !== undefined && (
            <span className='text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full'>
              {count}
            </span>
          )}
        </div>
        {onAddScene && (
          <button
            className='text-lg font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer p-1 rounded hover:bg-primary/10'
            onClick={handleAddScene}
            title='Adicionar nova cena'
          >
            +
          </button>
        )}
      </div>

      <div
        className='flex-1 overflow-y-auto px-1 py-1 space-y-2'
        style={{
          scrollbarGutter: 'stable',
          maxHeight: 'calc(100vh - 12rem)' // Altura máxima para o conteúdo
        }}
      >
        {children}
      </div>

      {/* Tooltip para feedback visual */}
      {columnState.tooltipMessage && isOver && (
        <div className='absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center pointer-events-none'>
          <span className='text-xs text-primary bg-background px-2 py-1 rounded shadow-sm'>
            {columnState.tooltipMessage}
          </span>
        </div>
      )}
    </div>
  );
});

Column.displayName = 'Column';
