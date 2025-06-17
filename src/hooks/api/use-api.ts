import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { arrayMove } from '@dnd-kit/sortable'
import { type Production, type Scene } from '../../types'

// ===== PRODUÇÕES =====
const fetchProductions = async (): Promise<Production[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/productions`)

    if (!response.ok) {
        throw new Error('Failed to fetch productions')
    }

    return response.json()
}

export const useProductions = () => {
    return useQuery({
        queryKey: ['productions'],
        queryFn: fetchProductions,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    })
}

// ===== CENAS =====
const fetchScenes = async (): Promise<Scene[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`)

    if (!response.ok) {
        throw new Error('Failed to fetch scenes')
    }

    return response.json()
}

const moveScene = async ({ id, toStep }: { id: string; toStep: number }): Promise<Scene> => {
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
        // Cria um erro com informações de status para melhor tratamento
        const error = new Error(`Erro ao mover cena`)
            ; (error as any).status = response.status
            ; (error as any).statusText = response.statusText
        throw error
    }

    return response.json()
}

const updateScene = async (scene: Scene): Promise<Scene> => {
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
        // Cria um erro com informações de status para melhor tratamento
        const error = new Error(`Erro ao atualizar cena`)
            ; (error as any).status = response.status
            ; (error as any).statusText = response.statusText
        throw error
    }

    return response.json()
}

const createScene = async (scene: Omit<Scene, 'id'>): Promise<Scene> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...scene,
            id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Gera ID temporário
        })
    })

    if (!response.ok) {
        // Cria um erro com informações de status para melhor tratamento
        const error = new Error(`Erro ao criar cena`)
            ; (error as any).status = response.status
            ; (error as any).statusText = response.statusText
        throw error
    }

    return response.json()
}

export const useScenes = () => {
    return useQuery({
        queryKey: ['scenes'],
        queryFn: fetchScenes,
        staleTime: Infinity, // Nunca fica stale
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    })
}

export const useMoveScene = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: moveScene,
        onMutate: async ({ id, toStep }) => {
            // Cancela queries em andamento para evitar conflitos
            await queryClient.cancelQueries({ queryKey: ['scenes'] })

            // Snapshot do estado anterior
            const previousScenes = queryClient.getQueryData(['scenes'])

            // Atualização otimista
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return oldData
                return oldData.map(scene =>
                    scene.id === id ? { ...scene, step: toStep } : scene
                )
            })

            // Retorna o contexto para rollback
            return { previousScenes }
        },
        onSuccess: (updatedScene) => {
            // Atualiza o cache com os dados do servidor
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return [updatedScene]
                return oldData.map(scene =>
                    scene.id === updatedScene.id ? updatedScene : scene
                )
            })
        },
        onError: (error, variables, context) => {
            // Rollback em caso de erro
            if (context?.previousScenes) {
                queryClient.setQueryData(['scenes'], context.previousScenes)
            }
            console.error('Erro ao mover cena:', error)
        },
        onSettled: () => {
            // Não invalida queries automaticamente
        }
    })
}

export const useReorderScene = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, toStep, toIndex, fromStep, fromIndex }: {
            id: string
            toStep: number
            toIndex: number
            fromStep?: number
            fromIndex?: number
        }) => {
            // Simula uma chamada de API bem-sucedida
            // Na implementação real, aqui seria a chamada para a API
            return { id, step: toStep }
        },
        onMutate: async ({ id, toStep, toIndex, fromStep, fromIndex }) => {
            // Cancela queries em andamento para evitar conflitos
            await queryClient.cancelQueries({ queryKey: ['scenes'] })

            // Snapshot do estado anterior
            const previousScenes = queryClient.getQueryData(['scenes'])

            // Atualização otimista
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return oldData

                // Filtra as cenas da coluna de origem
                const columnScenes = oldData.filter(scene => scene.step === fromStep)
                const otherScenes = oldData.filter(scene => scene.step !== fromStep)

                // Reordena as cenas na coluna usando arrayMove
                const reorderedColumnScenes = arrayMove(columnScenes, fromIndex!, toIndex)

                // Retorna todas as cenas com a coluna reordenada
                return [...otherScenes, ...reorderedColumnScenes]
            })

            // Retorna o contexto para rollback
            return { previousScenes }
        },
        onSuccess: (updatedScene) => {
            // A atualização já foi feita no onMutate, então não precisa fazer nada aqui
        },
        onError: (error, variables, context) => {
            // Rollback em caso de erro
            if (context?.previousScenes) {
                queryClient.setQueryData(['scenes'], context.previousScenes)
            }
            console.error('Erro ao reordenar cena:', error)
        },
        onSettled: () => {
            // Não invalida queries automaticamente
        }
    })
}

export const useUpdateScene = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateScene,
        onMutate: async (updatedScene) => {
            await queryClient.cancelQueries({ queryKey: ['scenes'] })

            const previousScenes = queryClient.getQueryData(['scenes'])

            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return oldData
                return oldData.map(scene =>
                    scene.id === updatedScene.id ? updatedScene : scene
                )
            })

            return { previousScenes }
        },
        onSuccess: (updatedScene) => {
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return [updatedScene]
                return oldData.map(scene =>
                    scene.id === updatedScene.id ? updatedScene : scene
                )
            })
        },
        onError: (error, variables, context) => {
            // Rollback em caso de erro
            if (context?.previousScenes) {
                queryClient.setQueryData(['scenes'], context.previousScenes)
            }
            console.error('Erro ao atualizar cena:', error)
        },
        onSettled: () => {
            // Não invalida queries automaticamente
        }
    })
}

export const useCreateScene = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createScene,
        onMutate: async (newScene) => {
            // Cancela queries em andamento para evitar conflitos
            await queryClient.cancelQueries({ queryKey: ['scenes'] })

            // Snapshot do estado anterior
            const previousScenes = queryClient.getQueryData(['scenes'])

            // Cria uma cena temporária com ID gerado
            const tempScene: Scene = {
                ...newScene,
                id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }

            // Adiciona a nova cena ao cache
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return [tempScene]

                // Adiciona a nova cena sem re-ordenar
                return [...oldData, tempScene]
            })

            // Retorna o contexto para rollback
            return { previousScenes, tempScene }
        },
        onSuccess: (createdScene, variables, context) => {
            // Substitui a cena temporária pela cena real do servidor
            queryClient.setQueryData(['scenes'], (oldData: Scene[] | undefined) => {
                if (!oldData) return [createdScene]

                return oldData.map(scene =>
                    scene.id === context?.tempScene.id ? createdScene : scene
                )
            })
        },
        onError: (error, variables, context) => {
            // Rollback em caso de erro
            if (context?.previousScenes) {
                queryClient.setQueryData(['scenes'], context.previousScenes)
            }
            console.error('Erro ao criar cena:', error)
        },
        onSettled: () => {
            // Não invalida queries automaticamente
        }
    })
} 