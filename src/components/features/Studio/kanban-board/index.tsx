import { memo, useMemo, useCallback, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Column } from '../../../shared/column'
import { Scene, type SceneProps } from '../scene'
import { type Scene as SceneType } from '../../../../reducers/scenes'
import { PRODUCTION_STEPS } from '../../../../utils/scene-transitions'

interface KanbanBoardProps {
    scenes: SceneType[]
    activeScene: SceneProps | null
    onDragStart: (event: any) => void
    onDragEnd: (event: any) => void
    onSceneUpdate: (scene: SceneType) => void
}

/**
 * Componente do Kanban Board que exibe as cenas organizadas por etapas
 * Gerencia o drag and drop e a renderização das colunas
 * Otimizado para evitar re-renders desnecessários
 */
export const KanbanBoard = memo(({
    scenes,
    activeScene,
    onDragStart,
    onDragEnd,
    onSceneUpdate
}: KanbanBoardProps) => {
    const [isDragging, setIsDragging] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
    )

    // Memoiza o callback de update para evitar re-renders
    const memoizedOnSceneUpdate = useCallback((scene: SceneType) => {
        onSceneUpdate(scene)
    }, [onSceneUpdate])

    // Memoiza as colunas para evitar re-renders desnecessários
    const columns = useMemo(() => {
        return Object.keys(PRODUCTION_STEPS).map((stepKey) => {
            const step = Number(stepKey)
            const columnScenes = scenes.filter((scene) => scene.step === step)

            return (
                <Column
                    key={step}
                    id={`column-${step}`}
                    step={step}
                    label={PRODUCTION_STEPS[step as keyof typeof PRODUCTION_STEPS]}
                    count={columnScenes.length}
                >
                    {columnScenes.map((scene) => (
                        <Scene key={scene.id} {...scene} onUpdate={memoizedOnSceneUpdate} />
                    ))}
                </Column>
            )
        })
    }, [scenes, memoizedOnSceneUpdate])

    const handleDragStart = useCallback((event: any) => {
        setIsDragging(true)
        onDragStart(event)
    }, [onDragStart])

    const handleDragEnd = useCallback((event: any) => {
        setIsDragging(false)
        onDragEnd(event)
    }, [onDragEnd])

    return (
        <div className={`kanban-container flex gap-4 overflow-x-auto w-full h-full ${isDragging ? 'dragging' : ''}`}>
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                {columns}

                <DragOverlay dropAnimation={null}>
                    {activeScene ? <Scene {...activeScene} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
})

KanbanBoard.displayName = 'KanbanBoard' 