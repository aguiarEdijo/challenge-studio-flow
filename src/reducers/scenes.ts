type Scene = {
  id: string;
  title: string;
  description: string;
  step: number;
  columnId: string;
  episode: string;
  recordDate: string;
  recordLocation: string;
};

type State = {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
};

const initialSceneState: State = {
  scenes: [],
  loading: false,
  error: null,
};

type Action =
  | { type: 'SET_SCENES'; payload: Scene[] }
  | { type: 'MOVE_SCENE'; payload: { id: string; toStep: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SCENE'; payload: Scene };

const sceneReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SCENES':
      return { ...state, scenes: action.payload, error: null };

    case 'MOVE_SCENE':
      const sceneToMove = state.scenes.find(scene => scene.id === action.payload.id)
      if (!sceneToMove || sceneToMove.step === action.payload.toStep) {
        return state
      }

      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id
            ? { ...scene, step: action.payload.toStep }
            : scene
        ),
      };

    case 'UPDATE_SCENE':
      const sceneToUpdate = state.scenes.find(scene => scene.id === action.payload.id)
      if (!sceneToUpdate) {
        return state
      }

      const hasChanges = Object.keys(action.payload).some(key =>
        sceneToUpdate[key as keyof Scene] !== action.payload[key as keyof Scene]
      )

      if (!hasChanges) {
        return state
      }

      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id ? { ...scene, ...action.payload } : scene
        ),
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export { initialSceneState, sceneReducer, type Scene };
