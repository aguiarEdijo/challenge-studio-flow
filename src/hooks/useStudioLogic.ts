import { useCallback, useState } from 'react'
import { useProductions, useScenes, useMoveScene, useReorderScene, useUpdateScene, useCreateScene } from './api/use-api'
import { useDragAndDrop } from './useDragAndDrop'
import { type Scene } from '../types'
import { getFirstErrorMessage } from '../utils/error-handling'

export function useStudioLogic() {
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
        await moveSceneMutation.mutateAsync({ id, toStep })
    }, [moveSceneMutation])

    const handleReorderScene = useCallback(async (id: string, toStep: number, toIndex: number, fromStep?: number, fromIndex?: number) => {
        await reorderSceneMutation.mutateAsync({ id, toStep, toIndex, fromStep, fromIndex })
    }, [reorderSceneMutation])

    const handleUpdateScene = useCallback(async (scene: Scene) => {
        await updateSceneMutation.mutateAsync(scene)
    }, [updateSceneMutation])

    const handleCreateScene = useCallback(async (scene: Omit<Scene, 'id'>) => {
        await createSceneMutation.mutateAsync(scene)
    }, [createSceneMutation])

    // Modal handlers
    const handleAddScene = useCallback((step: number) => {
        setIsCreating(true)
        setSelectedScene(undefined)
        setIsModalOpen(true)
    }, [])

    const handleEditScene = useCallback((scene: Scene) => {
        setIsCreating(false)
        setSelectedScene(scene)
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setIsCreating(false)
        setSelectedScene(undefined)
    }, [])

    // Drag and drop logic
    const dragAndDropState = useDragAndDrop(handleMoveScene, handleReorderScene, scenes)

    // Error handling
    const hasErrors = !!moveSceneMutation.error || !!updateSceneMutation.error || !!createSceneMutation.error
    const errorMessage = getFirstErrorMessage(moveSceneMutation.error, updateSceneMutation.error, createSceneMutation.error)

    const clearErrors = useCallback(() => {
        moveSceneMutation.reset()
        updateSceneMutation.reset()
        createSceneMutation.reset()
    }, [moveSceneMutation, updateSceneMutation, createSceneMutation])

    return {
        // Data
        productions,
        scenes,

        // Loading states
        isLoading: productionsLoading || scenesLoading,

        // Error states
        hasErrors,
        errorMessage,
        clearErrors,
        productionsError,
        scenesError,

        // Modal state
        isModalOpen,
        isCreating,
        selectedScene,

        // Handlers
        handleAddScene,
        handleEditScene,
        handleCloseModal,
        handleUpdateScene,
        handleCreateScene,

        // Drag and drop
        ...dragAndDropState
    }
} 