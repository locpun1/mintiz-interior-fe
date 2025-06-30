// src/hooks/usePageTitle.ts

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { PAGE_TITLES } from '@/constants/page-titles';

const usePageTitle = (): string => {
  const { pathname } = useLocation();

  const title = useMemo(() => {
    // Tìm chính xác path trong object PAGE_TITLES
    const exactMatch = PAGE_TITLES[pathname];
    if (exactMatch) {
      return exactMatch;
    }
    
    // Nếu không có match chính xác, thử tìm match theo dạng /path/:id
    // Ví dụ: pathname là /posts/edit/123
    // Chúng ta sẽ thử tìm key /posts/edit/:id trong PAGE_TITLES
    const dynamicRouteKey = Object.keys(PAGE_TITLES).find(key => {
      // Biến key thành một regex, thay thế :param thành một group regex
      const regex = new RegExp(`^${key.replace(/:\w+/g, '(\\w+)')}$`);
      return regex.test(pathname);
    });

    if (dynamicRouteKey) {
        return PAGE_TITLES[dynamicRouteKey];
    }

    // Nếu không tìm thấy, trả về một title mặc định
    return 'Mintz Funi'; // Hoặc tên công ty của bạn
  }, [pathname]);

  return title;
};

export default usePageTitle;