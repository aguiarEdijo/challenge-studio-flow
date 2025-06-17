import { StudioHeader } from './studio-header'
import { KanbanBoard } from './kanban-board'
import { StudioStates } from './studio-states'
import { StudioFeedback } from './studio-feedback'
import type { Scene } from '../../../../types'

interface StudioLayoutProps {
    // Header
    onBack: () => void

    // Content
    isLoading: boolean
    productionsError?: Error | null
    scenesError?: Error | null
    scenes: Scene[]
    activeScene: any
    onDragStart: (event: any) => void
    onDragEnd: (event: any) => void
    onSceneUpdate: (scene: Scene) => void
    onAddScene: (step: number) => void

    // Feedback
    showInvalidTransition: boolean
    transitionMessage: string
    showSuccessFeedback: boolean
    successMessage: string
    hasErrors: boolean
    errorMessage: string
    onClearErrors: () => void
    pendingTransition: any
    onCancelTransition: () => void
    onConfirmTransition: () => void
    isConfirming: boolean
    isModalOpen: boolean
    onCloseModal: () => void
    selectedScene?: Scene
    onUpdateScene: (scene: Scene) => Promise<void>
    onCreateScene: (scene: Omit<Scene, 'id'>) => Promise<void>
    isCreating: boolean
}

export function StudioLayout({
    onBack,
    isLoading,
    productionsError,
    scenesError,
    scenes,
    activeScene,
    onDragStart,
    onDragEnd,
    onSceneUpdate,
    onAddScene,
    showInvalidTransition,
    transitionMessage,
    showSuccessFeedback,
    successMessage,
    hasErrors,
    errorMessage,
    onClearErrors,
    pendingTransition,
    onCancelTransition,
    onConfirmTransition,
    isConfirming,
    isModalOpen,
    onCloseModal,
    selectedScene,
    onUpdateScene,
    onCreateScene,
    isCreating
}: StudioLayoutProps) {
    return (
        <div className='w-full h-screen flex flex-col bg-background'>
            <StudioHeader onBack={onBack} />

            <StudioStates
                isLoading={isLoading}
                productionsError={productionsError}
                scenesError={scenesError}
            >
                <div className='flex-1 flex flex-col min-h-0'>
                    <KanbanBoard
                        scenes={scenes}
                        activeScene={activeScene}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onSceneUpdate={onSceneUpdate}
                        onAddScene={onAddScene}
                    />
                </div>
            </StudioStates>

            <StudioFeedback
                showInvalidTransition={showInvalidTransition}
                transitionMessage={transitionMessage}
                showSuccessFeedback={showSuccessFeedback}
                successMessage={successMessage}
                hasErrors={hasErrors}
                errorMessage={errorMessage}
                onClearErrors={onClearErrors}
                pendingTransition={pendingTransition}
                onCancelTransition={onCancelTransition}
                onConfirmTransition={onConfirmTransition}
                isConfirming={isConfirming}
                isModalOpen={isModalOpen}
                onCloseModal={onCloseModal}
                selectedScene={selectedScene}
                onUpdateScene={onUpdateScene}
                onCreateScene={onCreateScene}
                isCreating={isCreating}
            />
        </div>
    )
} 