import { useMemo, useCallback, memo } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { type Scene as SceneType } from '../../../../types';

interface SceneProps {
  id: string;
  step: number;
  title: string;
  columnId: string;
  description: string;
  episode: string;
  recordDate: string;
  recordLocation: string;
  onUpdate?: (scene: SceneType) => void;
}

/**
 * Função de computação pesada memoizada
 * Processa o texto para exibição
 */
const heavyComputation = (text: string) => {
  return text.trim();
};

/**
 * Componente de cena otimizado com React.memo
 * Evita re-renders desnecessários quando as props não mudam
 * Suporta reordenação usando @dnd-kit/sortable
 */
const Scene = memo(({
  id,
  title,
  description,
  columnId,
  step,
  episode,
  recordDate,
  recordLocation,
  onUpdate,
}: SceneProps) => {
  // Memoiza os valores computados para evitar recálculos desnecessários
  const computedTitle = useMemo(() => {
    return heavyComputation(title);
  }, [title]);

  const computedDescription = useMemo(() => {
    return heavyComputation(description);
  }, [description]);

  // Memoiza os dados do drag and drop
  const dragData = useMemo(() => ({
    columnId,
    step,
    title,
    description,
    episode,
    recordDate,
    recordLocation,
  }), [columnId, step, title, description, episode, recordDate, recordLocation]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: dragData,
  });

  // Memoiza os detalhes da cena
  const sceneDetails: SceneType = useMemo(() => ({
    id,
    title,
    description,
    step,
    episode,
    columnId,
    recordDate,
    recordLocation,
  }), [id, title, description, step, episode, columnId, recordDate, recordLocation]);

  // Callback memoizado para abrir o modal de edição
  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    // Previne a abertura do modal durante o drag
    if (isDragging) return;

    // Previne a propagação do evento para evitar conflitos
    e.preventDefault();
    e.stopPropagation();

    console.log('Scene clicked:', sceneDetails); // Debug

    // Chama o callback de edição passado do componente pai
    if (onUpdate) {
      onUpdate(sceneDetails);
    }
  }, [isDragging, onUpdate, sceneDetails]);

  // Memoiza o conteúdo da cena para evitar re-renders
  const sceneContent = useMemo(() => (
    <div
      className='flex flex-col gap-1 select-none cursor-pointer'
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
    >
      <span className='text-sm font-medium leading-tight'>{computedTitle}</span>
      <span className='text-xs leading-tight text-accent/80'>{computedDescription}</span>
    </div>
  ), [computedTitle, computedDescription, isDragging]);

  // Memoiza o className para evitar recriações
  const sceneClassName = useMemo(() => `
    scene-card drag-optimized
    flex flex-col gap-2 p-2.5 ml-1
    cursor-grab active:cursor-grabbing
    rounded-lg border border-border/50
    select-none touch-none
    relative
    ${isDragging
      ? 'bg-primary/90 text-accent shadow-2xl scale-105 rotate-1 z-50'
      : 'bg-primary text-accent hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]'
    }
  `, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={sceneClassName}
      onClick={handleOpenModal}
    >
      {sceneContent}
    </div>
  );
});

Scene.displayName = 'Scene';

export { Scene, type SceneProps };
