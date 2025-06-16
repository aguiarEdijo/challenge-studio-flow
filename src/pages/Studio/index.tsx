import { useEffect, useReducer, useState } from 'react';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeftIcon, PlayIcon } from 'lucide-react';

import { Button } from '../../components/shared/button';
import { Card } from '../../components/shared/card';
import { Column } from '../../components/shared/column';
import { Scene, type SceneProps } from '../../components/features/Studio/scene';
import Title from '../../components/features/Studio/title';
import { useProduction } from '../../hooks/useProduction';
import { type Scene as SceneDetails, initialSceneState, sceneReducer } from '../../reducers/scenes';

const steps: Record<number, string> = {
  1: 'Roteirizado',
  2: 'Em pré-produção',
  3: 'Em gravação',
  4: 'Em pós-produção',
  5: 'Finalizado',
};

const Studio = () => {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction();

  const [state, dispatch] = useReducer(sceneReducer, initialSceneState);

  const [activeScene, setActiveScene] = useState<SceneProps | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveScene({
      id: active.id as string,
      step: active.data.current?.step,
      columnId: active.data.current?.columnId,
      title: active.data.current?.title,
      description: active.data.current?.description,
      episode: active.data.current?.episode,
      recordDate: active.data.current?.recordDate,
      recordLocation: active.data.current?.recordLocation,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveScene(null);

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const fromStep = active.data.current?.step;
    const toStep = over.data.current?.step;

    if (typeof toStep !== 'number' || fromStep === toStep) return;

    dispatch({
      type: 'MOVE_SCENE',
      payload: {
        id: active.id as string,
        toStep,
      },
    });
  };

  const handleSceneUpdate = (updatedScene: SceneDetails) => {
    dispatch({
      type: 'UPDATE_SCENE',
      payload: updatedScene,
    });
  };

  const fetchScenes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`);
      if (!response.ok) throw new Error('Failed to fetch scenes');

      const data = await response.json();
      dispatch({ type: 'SET_SCENES', payload: data });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    fetchScenes();
  }, []);

  if (!selectedProduction) {
    return (
      <div className='w-screen bg-background p-4 flex flex-col gap-4'>
        <div className='flex flex-wrap gap-4'>
          {productions.map((production) => (
            <Card
              key={production.id}
              icon={<PlayIcon />}
              title={production.name}
              subtitle={production.description}
              quickLinks={[
                {
                  label: 'Ir para produção',
                  onClick: () => {
                    selectProduction(production);
                  },
                },
              ]}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-background p-4 flex flex-col gap-4 h-full'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => deselectProduction()}>
          <ArrowLeftIcon />
        </Button>
        <Title />
      </div>
      <div className='flex gap-4 overflow-x-auto w-full h-full'>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <DragOverlay>{activeScene ? <Scene {...activeScene} /> : null}</DragOverlay>
          {[1, 2, 3, 4, 5].map((step) => (
            <Column
              key={step}
              id={`column-${step}`}
              step={step}
              label={steps[step]}
              count={state.scenes.filter((s) => s.step === step).length}
            >
              {state.scenes
                .filter((scene) => scene.step === step)
                .map((scene) => (
                  <Scene key={scene.id} {...scene} onUpdate={handleSceneUpdate} />
                ))}
            </Column>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default Studio;
