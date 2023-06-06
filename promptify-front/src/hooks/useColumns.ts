import { Visibility } from '@/types';
import { useState, useEffect } from 'react';

function useColumns(visibility: Visibility) {
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    if (visibility.showPS && visibility.showSS) {
      setColumns(2);
    } else if (!visibility.showPS && !visibility.showSS) {
      setColumns(4);
    } else {
      setColumns(3);
    }
  }, [visibility.showPS, visibility.showSS]);

  return columns;
}

export default useColumns