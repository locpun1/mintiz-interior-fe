import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePathCRUD() {
  const { pathname } = useLocation();

  const pathCRUD = useMemo(() => {
    const endsWith = (suffix: string) => pathname.endsWith(suffix);
    return {
      isCreate: endsWith('/create'),
      isUpdate: endsWith('/update'),
      isDetail: endsWith('/detail'),
    };
  }, [pathname]);

  return pathCRUD;
}
