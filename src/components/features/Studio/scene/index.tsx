import { useMemo, useState, useCallback, memo } from 'react';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { type Scene as SceneType } from '../../../../reducers/scenes';
import { Modal } from '../modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    attributes: { role: 'button' },
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

  // Callback memoizado para atualização
  const handleUpdate = useCallback((updatedScene: SceneType) => {
    if (onUpdate) {
      onUpdate(updatedScene);
    }
  }, [onUpdate]);

  // Callback memoizado para abrir o modal
  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    // Previne a abertura do modal durante o drag
    if (isDragging) return;
    e.stopPropagation();
    setIsModalOpen(true);
  }, [isDragging]);

  // Callback memoizado para fechar o modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const sceneContent = (
    <div
      className='flex flex-col gap-1 select-none'
      onClick={handleOpenModal}
    >
      <span className='text-sm font-medium leading-tight'>{computedTitle}</span>
      <span className='text-xs leading-tight text-accent/80'>{computedDescription}</span>
    </div>
  );

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        scene={sceneDetails}
        onUpdate={handleUpdate}
      />

      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Translate.toString(transform),
        }}
        {...listeners}
        {...attributes}
        className={`
          scene-card drag-optimized
          flex flex-col gap-2 p-3 
          cursor-grab active:cursor-grabbing
          rounded-lg border border-border/50
          select-none touch-none
          ${isDragging
            ? 'bg-primary/90 text-accent shadow-2xl scale-105 rotate-1 z-50'
            : 'bg-primary text-accent hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]'
          }
        `}
      >
        {sceneContent}
      </div>
    </div>
  );
});

Scene.displayName = 'Scene';

export { Scene, type SceneProps };
