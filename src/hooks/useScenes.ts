import { useCallback, useEffect, useReducer, useMemo } from 'react'
import { initialSceneState, sceneReducer, type Scene } from '../reducers/scenes'

/**
 * Hook especializado para gerenciar o estado das cenas
 * Centraliza toda a lógica de CRUD e estado das cenas
 */
export function useScenes() {
    const [state, dispatch] = useReducer(sceneReducer, initialSceneState)

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

    const moveScene = useCallback((id: string, toStep: number) => {
        dispatch({
            type: 'MOVE_SCENE',
            payload: { id, toStep },
        })
    }, [])

    const updateScene = useCallback((scene: Scene) => {
        dispatch({
            type: 'UPDATE_SCENE',
            payload: scene,
        })
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
        fetchScenes,
        moveScene,
        updateScene,
        getScenesByStep,
    }
} 