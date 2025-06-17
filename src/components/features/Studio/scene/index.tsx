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
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Callback memoizado para fechar o modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const sceneContent = (
    <div className='flex flex-col gap-1'>
      <span className='text-sm font-medium'>{computedTitle}</span>
      <span className='text-xs'>{computedDescription}</span>
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
        onClick={handleOpenModal}
        className={`flex flex-col gap-2 p-2 cursor-pointer rounded-lg border border-border ${isDragging
          ? 'bg-primary/50 text-accent/80'
          : 'bg-primary text-accent hover:bg-primary/90'
          }`}
      >
        {sceneContent}
      </div>
    </div>
  );
});

Scene.displayName = 'Scene';

export { Scene, type SceneProps };
