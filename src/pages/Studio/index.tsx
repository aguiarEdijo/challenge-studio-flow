import { useProduction } from '../../hooks/useProduction'
import { useScenes } from '../../hooks/useScenes'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { ProductionList } from '../../components/features/Studio/production-list'
import { StudioHeader } from '../../components/features/Studio/studio-header'
import { KanbanBoard } from '../../components/features/Studio/kanban-board'
import { TransitionFeedback } from '../../components/features/Studio/transition-feedback'
import { ErrorFeedback } from '../../components/shared/error-feedback'
import { TransitionConfirmationModal } from '../../components/features/Studio/transition-confirmation-modal'

const Studio = () => {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction()
  const { scenes, moveScene, updateScene, operationError, clearOperationError } = useScenes()
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
  } = useDragAndDrop(moveScene)

  if (!selectedProduction) {
    return <ProductionList productions={productions} onSelectProduction={selectProduction} />
  }

  return (
    <div className='w-full bg-background p-4 flex flex-col gap-4 h-full'>
      <StudioHeader onBack={deselectProduction} />

      <KanbanBoard
        scenes={scenes}
        activeScene={activeScene}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onSceneUpdate={updateScene}
      />

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
        isVisible={!!operationError}
        message={operationError || ''}
        onClose={clearOperationError}
        autoHide={true}
        autoHideDelay={5000}
      />

      {/* Modal de confirmação de transição */}
      <TransitionConfirmationModal
        isOpen={!!pendingTransition}
        onClose={handleCancelTransition}
        onConfirm={handleConfirmTransition}
        sceneTitle={pendingTransition?.sceneTitle || ''}
        fromStep={pendingTransition?.fromStep || 1}
        toStep={pendingTransition?.toStep || 1}
        isConfirming={isConfirming}
      />
    </div>
  )
}

export default Studio
