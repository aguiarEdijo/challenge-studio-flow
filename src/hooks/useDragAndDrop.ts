import { useCallback, useState, useEffect } from 'react'
import { type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { type Scene } from '../reducers/scenes'
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

/**
 * Hook especializado para gerenciar o drag and drop das cenas
 * Centraliza a lógica de drag and drop e mantém o estado do item ativo
 * Aplica regras de transição válidas entre etapas com mensagens específicas
 * Inclui confirmação antes de executar transições válidas
 */
export function useDragAndDrop(onMoveScene: (id: string, toStep: number) => Promise<void>) {
    const [activeScene, setActiveScene] = useState<DragSceneData | null>(null)
    const [showInvalidTransition, setShowInvalidTransition] = useState(false)
    const [transitionMessage, setTransitionMessage] = useState('')
    const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null)
    const [isConfirming, setIsConfirming] = useState(false)
    const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Remove a mensagem de erro automaticamente após 1 segundo
    useEffect(() => {
        if (showInvalidTransition) {
            const timer = setTimeout(() => {
                setShowInvalidTransition(false)
                setTransitionMessage('')
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [showInvalidTransition])

    // Remove a mensagem de sucesso automaticamente após 2 segundos
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
        // Remove mensagem de erro ao iniciar novo drag
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

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        setActiveScene(null)

        const { active, over } = event

        if (!over || active.id === over.id) return

        const fromStep = active.data.current?.step
        const toStep = over.data.current?.step

        if (typeof toStep !== 'number' || typeof fromStep !== 'number') return

        // Valida a transição e obtém mensagem específica
        const validation = validateTransition(fromStep, toStep)

        if (validation.isValid) {
            // Em vez de executar imediatamente, armazena a transição pendente
            setPendingTransition({
                sceneId: active.id as string,
                fromStep,
                toStep,
                sceneTitle: active.data.current?.title || 'Cena sem título'
            })
        } else {
            // Mostra feedback visual com mensagem específica
            setTransitionMessage(validation.message)
            setShowInvalidTransition(true)
        }
    }, [])

    const handleConfirmTransition = useCallback(async () => {
        if (!pendingTransition) return

        setIsConfirming(true)

        try {
            await onMoveScene(pendingTransition.sceneId, pendingTransition.toStep)
            // Fecha o modal de confirmação após sucesso
            setPendingTransition(null)
            // Mostra feedback de sucesso
            setSuccessMessage(`Cena "${pendingTransition.sceneTitle}" movida com sucesso!`)
            setShowSuccessFeedback(true)
        } catch (error) {
            // O erro será tratado pelo hook useScenes e exibido pelo ErrorFeedback
            console.error('Erro ao mover cena:', error)
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