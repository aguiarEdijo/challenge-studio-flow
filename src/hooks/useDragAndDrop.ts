import { useCallback, useState, useEffect } from 'react'
import { type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { type Scene } from '../types'
import { validateTransition } from '../utils/scene-transitions'


interface DragSceneData {
    id: string
    step: number
    columnId: string
    title: string
    description: string
    episode: string
    recordDate: string
    recordLocation: string
}

interface PendingTransition {
    sceneId: string
    fromStep: number
    toStep: number
    sceneTitle: string
}


export function useDragAndDrop(
    onMoveScene: (id: string, toStep: number) => Promise<void>,
    onReorderScene: (id: string, toStep: number, toOrder: number, fromStep?: number, fromOrder?: number) => Promise<void>,
    scenes: Scene[]
) {
    const [activeScene, setActiveScene] = useState<DragSceneData | null>(null)
    const [showInvalidTransition, setShowInvalidTransition] = useState(false)
    const [transitionMessage, setTransitionMessage] = useState('')
    const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null)
    const [isConfirming, setIsConfirming] = useState(false)
    const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (showInvalidTransition) {
            const timer = setTimeout(() => {
                setShowInvalidTransition(false)
                setTransitionMessage('')
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [showInvalidTransition])

    useEffect(() => {
        if (showSuccessFeedback) {
            const timer = setTimeout(() => {
                setShowSuccessFeedback(false)
                setSuccessMessage('')
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [showSuccessFeedback])

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setShowInvalidTransition(false)
        setTransitionMessage('')

        const { active } = event
        const data = active.data.current as DragSceneData

        setActiveScene({
            id: active.id as string,
            step: data.step,
            columnId: data.columnId,
            title: data.title,
            description: data.description,
            episode: data.episode,
            recordDate: data.recordDate,
            recordLocation: data.recordLocation,
        })
    }, [])

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveScene(null)

        const { active, over } = event

        if (!over || active.id === over.id) return

        const activeData = active.data.current as DragSceneData
        const overData = over.data.current as DragSceneData

        if (!activeData || !overData) return

        const fromStep = activeData.step
        const toStep = overData.step

        if (fromStep === toStep) {
            const columnScenes = scenes.filter(scene => scene.step === fromStep)
            const activeSceneIndex = columnScenes.findIndex(scene => scene.id === active.id)
            const overSceneIndex = columnScenes.findIndex(scene => scene.id === over.id)

            if (activeSceneIndex === -1 || overSceneIndex === -1) return

            if (activeSceneIndex === overSceneIndex) return

            onReorderScene(
                active.id as string,
                toStep,
                overSceneIndex,
                fromStep,
                activeSceneIndex
            )

            setSuccessMessage(`Cena "${activeData.title}" reordenada com sucesso!`)
            setShowSuccessFeedback(true)
            return
        }

        const validation = validateTransition(fromStep, toStep)

        if (validation.isValid) {
            setPendingTransition({
                sceneId: active.id as string,
                fromStep,
                toStep,
                sceneTitle: activeData.title || 'Cena sem título'
            })
        } else {
            setTransitionMessage(validation.message)
            setShowInvalidTransition(true)
        }
    }, [scenes, onReorderScene])

    const handleConfirmTransition = useCallback(async () => {
        if (!pendingTransition) return

        setIsConfirming(true)

        try {
            await onMoveScene(pendingTransition.sceneId, pendingTransition.toStep)
            setPendingTransition(null)
            setSuccessMessage(`Cena "${pendingTransition.sceneTitle}" movida com sucesso!`)
            setShowSuccessFeedback(true)
        } catch (error) {
            console.error('Erro ao mover cena:', error)
            // Aqui você pode adicionar um estado de erro se quiser mostrar feedback de erro
            // Por enquanto, apenas loga o erro
        } finally {
            setIsConfirming(false)
        }
    }, [pendingTransition, onMoveScene])

    const handleCancelTransition = useCallback(() => {
        setPendingTransition(null)
        setIsConfirming(false)
    }, [])

    return {
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
        handleCancelTransition,
    }
} 