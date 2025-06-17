import { useCallback, useEffect, useReducer, useMemo, useState } from 'react'
import { initialSceneState, sceneReducer, type Scene } from '../reducers/scenes'

/**
 * Hook especializado para gerenciar o estado das cenas
 * Centraliza toda a lógica de CRUD e estado das cenas
 */
export function useScenes() {
    const [state, dispatch] = useReducer(sceneReducer, initialSceneState)
    const [operationError, setOperationError] = useState<string | null>(null)

    const fetchScenes = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`)
            if (!response.ok) throw new Error('Failed to fetch scenes')

            const data = await response.json()
            dispatch({ type: 'SET_SCENES', payload: data })
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err instanceof Error ? err.message : 'Unknown error',
            })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }, [])

    const moveScene = useCallback(async (id: string, toStep: number) => {
        try {
            setOperationError(null)

            // Atualiza o estado local imediatamente para feedback visual
            dispatch({
                type: 'MOVE_SCENE',
                payload: { id, toStep },
            })

            // Faz a requisição para a API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    step: toStep,
                    updatedAt: new Date().toISOString()
                })
            })

            if (!response.ok) {
                throw new Error(`Erro ao mover cena: ${response.statusText}`)
            }

            // Se chegou aqui, a operação foi bem-sucedida
            const updatedScene = await response.json()

            // Atualiza o estado com os dados da API
            dispatch({
                type: 'UPDATE_SCENE',
                payload: updatedScene,
            })

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao mover cena'
            setOperationError(errorMessage)

            // Reverte a mudança no estado local em caso de erro
            dispatch({
                type: 'MOVE_SCENE',
                payload: { id, toStep: state.scenes.find(s => s.id === id)?.step || 0 },
            })
        }
    }, [state.scenes])

    const updateScene = useCallback(async (scene: Scene) => {
        try {
            setOperationError(null)

            // Atualiza o estado local imediatamente para feedback visual
            dispatch({
                type: 'UPDATE_SCENE',
                payload: scene,
            })

            // Faz a requisição para a API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes/${scene.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...scene,
                    updatedAt: new Date().toISOString(),
                    version: Math.random()
                })
            })

            if (!response.ok) {
                throw new Error(`Erro ao atualizar cena: ${response.statusText}`)
            }

            // Se chegou aqui, a operação foi bem-sucedida
            const updatedScene = await response.json()

            // Atualiza o estado com os dados da API
            dispatch({
                type: 'UPDATE_SCENE',
                payload: updatedScene,
            })

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar cena'
            setOperationError(errorMessage)

            // Reverte a mudança no estado local em caso de erro
            const originalScene = state.scenes.find(s => s.id === scene.id)
            if (originalScene) {
                dispatch({
                    type: 'UPDATE_SCENE',
                    payload: originalScene,
                })
            }
        }
    }, [state.scenes])

    // Função para limpar erros de operação
    const clearOperationError = useCallback(() => {
        setOperationError(null)
    }, [])

    // Memoiza as cenas para evitar re-renders desnecessários
    const scenes = useMemo(() => state.scenes, [state.scenes])

    const getScenesByStep = useCallback((step: number) => {
        return scenes.filter((scene) => scene.step === step)
    }, [scenes])

    useEffect(() => {
        fetchScenes()
    }, [fetchScenes])

    return {
        scenes,
        loading: state.loading,
        error: state.error,
        operationError,
        clearOperationError,
        fetchScenes,
        moveScene,
        updateScene,
        getScenesByStep,
    }
} 