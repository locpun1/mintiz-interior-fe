export const CategoryNews = {
    EVENT : 'event',           
    ARCHITECTURE : 'architecture',
    LIFE: 'life',
    INFORMATION_TECH: 'information-tech',                      
}

export type CategoryNews = typeof CategoryNews[keyof typeof CategoryNews];

export const CATEGORY_LABELS: { [key in CategoryNews]: string} = {
    [CategoryNews.EVENT]: "SỰ KIỆN",
    [CategoryNews.ARCHITECTURE]: "KIẾN TRÚC",
    [CategoryNews.LIFE]: "ĐỜI SỐNG",
    [CategoryNews.INFORMATION_TECH]: "CÔNG NGHỆ",
}

export const RoleUser = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
}

export type RoleUser = typeof RoleUser[keyof typeof RoleUser];
export const ROLE_LABELS: { [key in RoleUser]: string} = {
    [RoleUser.ADMIN]: 'Quản trị viên',
    [RoleUser.EMPLOYEE]: 'Nhân viên kiểm soát'
}