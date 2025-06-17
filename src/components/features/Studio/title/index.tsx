import { useAppStore } from '../../../../stores/app-store';

const Title = () => {
  const { selectedProduction } = useAppStore();

  return <h1 className='text-2xl font-bold text-primary'>{selectedProduction?.name}</h1>;
};

export default Title;
