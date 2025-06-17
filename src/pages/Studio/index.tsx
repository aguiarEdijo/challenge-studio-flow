import { useProduction } from '../../hooks/useProduction'
import { useScenes } from '../../hooks/useScenes'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { ProductionList } from '../../components/features/Studio/production-list'
import { StudioHeader } from '../../components/features/Studio/studio-header'
import { KanbanBoard } from '../../components/features/Studio/kanban-board'
import { TransitionFeedback } from '../../components/features/Studio/transition-feedback'

const Studio = () => {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction()
  const { scenes, moveScene, updateScene } = useScenes()
  const { activeScene, showInvalidTransition, transitionMessage, handleDragStart, handleDragEnd } = useDragAndDrop(moveScene)

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
    </div>
  )
}

export default Studio
