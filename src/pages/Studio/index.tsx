import { useProductionSelection } from '../../hooks/useProductionSelection'
import { useStudioLogic } from '../../hooks/useStudioLogic'
import { ProductionList } from '../../components/features/Studio/production-list'
import { StudioLayout } from '../../components/features/Studio/studio-layout'

const Studio = () => {
  // Hook para gerenciar seleção de produção
  const {
    selectedProduction,
    storeError,
    selectProduction,
    deselectProduction,
    clearError
  } = useProductionSelection()

  // Hook customizado com toda a lógica de negócio
  const {
    productions,
    scenes,
    isLoading,
    hasErrors,
    errorMessage,
    clearErrors,
    productionsError,
    scenesError,
    isModalOpen,
    isCreating,
    selectedScene,
    handleAddScene,
    handleEditScene,
    handleCloseModal,
    handleUpdateScene,
    handleCreateScene,
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
  } = useStudioLogic()

  // Se não há produção selecionada, mostra a lista
  if (!selectedProduction) {
    return <ProductionList productions={productions} onSelectProduction={selectProduction} />
  }

  return (
    <StudioLayout
      onBack={deselectProduction}
      isLoading={isLoading}
      productionsError={productionsError}
      scenesError={scenesError}
      scenes={scenes}
      activeScene={activeScene}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onSceneUpdate={handleEditScene}
      onAddScene={handleAddScene}
      showInvalidTransition={showInvalidTransition}
      transitionMessage={transitionMessage}
      showSuccessFeedback={showSuccessFeedback}
      successMessage={successMessage}
      hasErrors={hasErrors || !!storeError}
      errorMessage={errorMessage || storeError || ''}
      onClearErrors={() => {
        clearErrors()
        clearError()
      }}
      pendingTransition={pendingTransition}
      onCancelTransition={handleCancelTransition}
      onConfirmTransition={handleConfirmTransition}
      isConfirming={isConfirming}
      isModalOpen={isModalOpen}
      onCloseModal={handleCloseModal}
      selectedScene={selectedScene}
      onUpdateScene={handleUpdateScene}
      onCreateScene={handleCreateScene}
      isCreating={isCreating}
    />
  )
}

export default Studio
