import { ClipLoader } from 'react-spinners';

export const Loader = ({ color, size }: { color: string; size: number }) => {

  return (
    <ClipLoader
      color={'#3498db'}
      size={size ? size : 40}
    />
  );
};
