import { memo, useMemo, useCallback, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Column } from '../../../shared/column'
import { Scene, type SceneProps } from '../scene'
import { type Scene as SceneType } from '../../../../types'
import { PRODUCTION_STEPS } from '../../../../utils/scene-transitions'

interface KanbanBoardProps {
    scenes: SceneType[]
    activeScene: SceneProps | null
    onDragStart: (event: any) => void
    onDragEnd: (event: any) => void
    onSceneUpdate: (scene: SceneType) => void
    onAddScene: (step: number) => void
}

/**
 * Componente do Kanban Board que exibe as cenas organizadas por etapas
 * Gerencia o drag and drop e a renderização das colunas
 * Otimizado para evitar re-renders desnecessários
 * Suporta reordenação dentro das colunas usando @dnd-kit/sortable
 * Inclui funcionalidade para adicionar novas cenas
 */
export const KanbanBoard = memo(({
    scenes,
    activeScene,
    onDragStart,
    onDragEnd,
    onSceneUpdate,
    onAddScene
}: KanbanBoardProps) => {
    const [isDragging, setIsDragging] = useState(false)

    // Configuração otimizada dos sensores para melhor fluidez
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150, // Aumentado para 150ms para permitir cliques
                tolerance: 5, // Reduzido para 5px para mais precisão
            },
        }),
    )

    // Memoiza o callback de update para evitar re-renders
    const memoizedOnSceneUpdate = useCallback((scene: SceneType) => {
        onSceneUpdate(scene)
    }, [onSceneUpdate])

    // Memoiza o callback de adicionar cena para evitar re-renders
    const memoizedOnAddScene = useCallback((step: number) => {
        onAddScene(step)
    }, [onAddScene])

    // Organiza as cenas por coluna
    const scenesByColumn = useMemo(() => {
        const organized: Record<number, SceneType[]> = {}

        Object.keys(PRODUCTION_STEPS).forEach((stepKey) => {
            const step = Number(stepKey)
            organized[step] = scenes
                .filter((scene) => scene.step === step)
        })

        return organized
    }, [scenes])

    // Memoiza as colunas para evitar re-renders desnecessários
    const columns = useMemo(() => {
        return Object.keys(PRODUCTION_STEPS).map((stepKey) => {
            const step = Number(stepKey)
            const columnScenes = scenesByColumn[step] || []
            const sceneIds = columnScenes.map(scene => scene.id)

            return (
                <Column
                    key={step}
                    id={`column-${step}`}
                    step={step}
                    label={PRODUCTION_STEPS[step as keyof typeof PRODUCTION_STEPS]}
                    count={columnScenes.length}
                    onAddScene={memoizedOnAddScene}
                >
                    <SortableContext items={sceneIds} strategy={verticalListSortingStrategy}>
                        {columnScenes.map((scene) => (
                            <Scene key={scene.id} {...scene} onUpdate={memoizedOnSceneUpdate} />
                        ))}
                    </SortableContext>
                </Column>
            )
        })
    }, [scenesByColumn, memoizedOnSceneUpdate, memoizedOnAddScene])

    const handleDragStart = useCallback((event: any) => {
        setIsDragging(true)
        onDragStart(event)
    }, [onDragStart])

    const handleDragEnd = useCallback((event: any) => {
        setIsDragging(false)
        onDragEnd(event)
    }, [onDragEnd])

    return (
        <div className={`kanban-container flex gap-4 overflow-x-auto w-full min-h-0 py-2`} style={{ scrollbarGutter: 'stable' }}>
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                collisionDetection={closestCenter}
            >
                {columns}
                <DragOverlay
                    dropAnimation={null}
                    modifiers={[]}
                >
                    {activeScene ? <Scene {...activeScene} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
})

KanbanBoard.displayName = 'KanbanBoard' 