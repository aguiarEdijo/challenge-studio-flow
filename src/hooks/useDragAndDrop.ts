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

/**
 * Hook especializado para gerenciar o drag and drop das cenas
 * Centraliza a lógica de drag and drop e mantém o estado do item ativo
 * Aplica regras de transição válidas entre etapas com mensagens específicas
 */
export function useDragAndDrop(onMoveScene: (id: string, toStep: number) => void) {
    const [activeScene, setActiveScene] = useState<DragSceneData | null>(null)
    const [showInvalidTransition, setShowInvalidTransition] = useState(false)
    const [transitionMessage, setTransitionMessage] = useState('')

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

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveScene(null)

        const { active, over } = event

        if (!over || active.id === over.id) return

        const fromStep = active.data.current?.step
        const toStep = over.data.current?.step

        if (typeof toStep !== 'number' || typeof fromStep !== 'number') return

        // Valida a transição e obtém mensagem específica
        const validation = validateTransition(fromStep, toStep)

        if (validation.isValid) {
            onMoveScene(active.id as string, toStep)
        } else {
            // Mostra feedback visual com mensagem específica
            setTransitionMessage(validation.message)
            setShowInvalidTransition(true)
        }
    }, [onMoveScene])

    return {
        activeScene,
        showInvalidTransition,
        transitionMessage,
        handleDragStart,
        handleDragEnd,
    }
} 