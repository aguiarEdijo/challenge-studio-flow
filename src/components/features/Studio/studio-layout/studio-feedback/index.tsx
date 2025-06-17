import { TransitionFeedback } from '../transition-feedback'
import { ErrorFeedback } from '../../../../shared/error-feedback'
import { TransitionConfirmationModal } from '../../modals/studio-transition-confirmation-modal'
import { Modal } from '../../modals/studio-modal'
import type { Scene } from '../../../../../types'

interface StudioFeedbackProps {
    // Transition feedback
    showInvalidTransition: boolean
    transitionMessage: string
    showSuccessFeedback: boolean
    successMessage: string

    // Error feedback
    hasErrors: boolean
    errorMessage: string
    onClearErrors: () => void

    // Confirmation modal
    pendingTransition: any
    onCancelTransition: () => void
    onConfirmTransition: () => void
    isConfirming: boolean

    // Scene modal
    isModalOpen: boolean
    onCloseModal: () => void
    selectedScene?: Scene
    onUpdateScene: (scene: Scene) => Promise<void>
    onCreateScene: (scene: Omit<Scene, 'id'>) => Promise<void>
    isCreating: boolean
}

export function StudioFeedback({
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
}: StudioFeedbackProps) {
    return (
        <>
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
                isVisible={hasErrors}
                message={errorMessage}
                onClose={onClearErrors}
                autoHide={true}
                autoHideDelay={3000}
            />
            <TransitionConfirmationModal
                isOpen={!!pendingTransition}
                onClose={onCancelTransition}
                onConfirm={onConfirmTransition}
                sceneTitle={pendingTransition?.sceneTitle || ''}
                fromStep={pendingTransition?.fromStep || 1}
                toStep={pendingTransition?.toStep || 1}
                isConfirming={isConfirming}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                scene={selectedScene}
                onUpdate={onUpdateScene}
                onCreate={onCreateScene}
                isCreating={isCreating}
            />
        </>
    )
} 