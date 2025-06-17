import { useAppStore } from '../../stores/app-store'
import { useProductions, useScenes, useMoveScene, useReorderScene, useUpdateScene, useCreateScene } from '../../hooks/api/use-api'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { ProductionList } from '../../components/features/Studio/production-list'
import { StudioHeader } from '../../components/features/Studio/studio-header'
import { KanbanBoard } from '../../components/features/Studio/kanban-board'
import { TransitionFeedback } from '../../components/features/Studio/transition-feedback'
import { ErrorFeedback } from '../../components/shared/error-feedback'
import { TransitionConfirmationModal } from '../../components/features/Studio/transition-confirmation-modal'
import { Modal } from '../../components/features/Studio/modal'
import { useCallback, useState } from 'react'
import { type Scene } from '../../types'

const Studio = () => {
  // Store unificado
  const {
    selectedProduction,
    selectProduction,
    deselectProduction,
    error: storeError,
    clearError
  } = useAppStore()

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>(undefined)

  // React Query hooks
  const { data: productions = [], isLoading: productionsLoading, error: productionsError } = useProductions()
  const { data: scenes = [], isLoading: scenesLoading, error: scenesError } = useScenes()

  // Mutations
  const moveSceneMutation = useMoveScene()
  const reorderSceneMutation = useReorderScene()
  const updateSceneMutation = useUpdateScene()
  const createSceneMutation = useCreateScene()

  // Callbacks memoizados para evitar re-renderizações
  const handleMoveScene = useCallback(async (id: string, toStep: number) => {
    try {
      await moveSceneMutation.mutateAsync({ id, toStep })
    } catch (error) {
      console.error('Erro ao mover cena:', error)
    }
  }, [moveSceneMutation])

  const handleReorderScene = useCallback(async (id: string, toStep: number, toIndex: number, fromStep?: number, fromIndex?: number) => {
    try {
      await reorderSceneMutation.mutateAsync({ id, toStep, toIndex, fromStep, fromIndex })
    } catch (error) {
      console.error('Erro ao reordenar cena:', error)
    }
  }, [reorderSceneMutation])

  const handleUpdateScene = useCallback(async (scene: Scene) => {
    try {
      await updateSceneMutation.mutateAsync(scene)
    } catch (error) {
      console.error('Erro ao atualizar cena:', error)
    }
  }, [updateSceneMutation])

  const handleCreateScene = useCallback(async (scene: Omit<Scene, 'id'>) => {
    try {
      await createSceneMutation.mutateAsync(scene)
    } catch (error) {
      console.error('Erro ao criar cena:', error)
    }
  }, [createSceneMutation])

  const handleAddScene = useCallback((step: number) => {
    setIsCreating(true)
    setSelectedScene(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEditScene = useCallback((scene: Scene) => {
    console.log('handleEditScene called:', scene); // Debug
    setIsCreating(false)
    setSelectedScene(scene)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setIsCreating(false)
    setSelectedScene(undefined)
  }, [])

  const {
    activeScene,
    showInvalidTransition,
    transitionMessage,
    pendingTransition,
    isConfirming,
    showSuccessFeedback,
    successMessage,
    handleDragStart,
    handleDragEnd,
    handleConfirmTransition,
    handleCancelTransition
  } = useDragAndDrop(handleMoveScene, handleReorderScene, scenes)

  // Loading states
  if (productionsLoading || scenesLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  // Error states
  if (productionsError || scenesError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-500">
          Erro ao carregar dados: {productionsError?.message || scenesError?.message}
        </div>
      </div>
    )
  }

  if (!selectedProduction) {
    return <ProductionList productions={productions} onSelectProduction={selectProduction} />
  }

  return (
    <div className='w-full h-screen flex flex-col bg-background'>
      <StudioHeader onBack={deselectProduction} />
      <div className='flex-1 flex flex-col min-h-0'>
        <KanbanBoard
          scenes={scenes}
          activeScene={activeScene}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onSceneUpdate={handleEditScene}
          onAddScene={handleAddScene}
        />
      </div>
      <TransitionFeedback
        isVisible={showInvalidTransition}
        message={transitionMessage}
        type="error"
      />
      <TransitionFeedback
        isVisible={showSuccessFeedback}
        message={successMessage}
        type="success"
      />
      <ErrorFeedback
        isVisible={!!moveSceneMutation.error || !!updateSceneMutation.error || !!createSceneMutation.error || !!storeError}
        message={moveSceneMutation.error?.message || updateSceneMutation.error?.message || createSceneMutation.error?.message || storeError || ''}
        onClose={() => {
          moveSceneMutation.reset()
          updateSceneMutation.reset()
          createSceneMutation.reset()
          clearError()
        }}
        autoHide={true}
        autoHideDelay={3000}
      />
      <TransitionConfirmationModal
        isOpen={!!pendingTransition}
        onClose={handleCancelTransition}
        onConfirm={handleConfirmTransition}
        sceneTitle={pendingTransition?.sceneTitle || ''}
        fromStep={pendingTransition?.fromStep || 1}
        toStep={pendingTransition?.toStep || 1}
        isConfirming={isConfirming}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        scene={selectedScene}
        onUpdate={handleUpdateScene}
        onCreate={handleCreateScene}
        isCreating={isCreating}
      />
    </div>
  )
}

export default Studio
