import { ROUTE_PATH } from "./routes";

export const DATA_ALL_GROUPS = [
    {
        id: 1,
        name: 'Nhóm quyền quản lý bài viết',
        permission: [
            {
                id: 1,
                code: '001',
                name: 'Trang chủ',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
                actions: [
                    { id: 1, code: '001001', name: 'Xem'},
                    { id: 2, code: '001005', name: 'Xem chi tiết'},
                ]
            },
            {
                id: 2,
                code: '003',
                name: 'Quản lý bài viết',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}`,
                actions: [
                    { id: 1, code: '003001', name: 'Xem'},
                    { id: 2, code: '003002', name: 'Lưu/Tạo', path: `/${ROUTE_PATH.BLOG_CREATE}`},
                    { id: 3, code: '003003', name: 'Cập nhật/Chỉnh sửa', path: `/${ROUTE_PATH.BLOG_EDIT}`},
                    { id: 4, code: '003005', name: 'Xem chi tiết', path: `/${ROUTE_PATH.BLOG_DETAIL}`}
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Nhóm quyền quản lý thông tin khách hàng',
        permission: [
            {
                id: 1,
                code: '001',
                name: 'Trang chủ',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
                actions: [
                    { id: 1, code: '001001', name: 'Xem'},
                    { id: 1, code: '001005', name: 'Xem chi tiết'},
                ]
            },
            {
                id: 2,
                code: '002',
                name: 'Quản lý thông tin',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MY_PROFILE}`,
                actions: [
                    { id: 1, code: '002001', name: 'Xem'},
                    { id: 1, code: '002005', name: 'Xem chi tiết'},
                ]
            },
        ]
    },
    {
        id: 3,
        name: 'Nhóm quyền quản lý thông tin và bài viết',
        permission: [
            {
                id: 1,
                code: '001',
                name: 'Trang chủ',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
                actions: [
                    { id: 1, code: '001001', name: 'Xem'},
                    { id: 1, code: '001005', name: 'Xem chi tiết'},
                ]
            },
            {
                id: 2,
                code: '002',
                name: 'Quản lý thông tin',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MY_PROFILE}`,
                actions: [
                    { id: 1, code: '002001', name: 'Xem'},
                    { id: 1, code: '002005', name: 'Xem chi tiết'},
                ]
            },
            {
                id: 3,
                code: '003',
                name: 'Quản lý bài viết',
                path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}`,
                actions: [
                    { id: 1, code: '003001', name: 'Xem'},
                    { id: 2, code: '003002', name: 'Lưu/Tạo', path: `/${ROUTE_PATH.BLOG_CREATE}`},
                    { id: 3, code: '003003', name: 'Cập nhật/Chỉnh sửa', path: `/${ROUTE_PATH.BLOG_EDIT}`},
                    { id: 4, code: '003005', name: 'Xem chi tiết', path: `/${ROUTE_PATH.BLOG_DETAIL}`}
                ]
            }
        ]
    }
];

export const modules = [
  {
    id: 1,
    code: "001",
    name: "Trang chủ",
    path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
    action: [
      { id: 1, code: "001001", name: "Xem" },
      { id: 2, code: "001005", name: "Xem chi tiết" }
    ]
  },
  {
    id: 2,
    code: "002",
    name: "Quản lý thông tin",
    path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MY_PROFILE}`,
    action: [
      { id: 1, code: "002001", name: "Xem" },
      { id: 2, code: "002005", name: "Xem chi tiết" }
    ]
  },
  {
    id: 3,
    code: "003",
    name: "Quản lý bài viết",
    path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}`,
    action: [
        { id: 1, code: '003001', name: 'Xem'},
        { id: 2, code: '003002', name: 'Lưu/Tạo', path: `/${ROUTE_PATH.BLOG_CREATE}`},
        { id: 3, code: '003003', name: 'Cập nhật/Chỉnh sửa', path: `/${ROUTE_PATH.BLOG_EDIT}`},
        { id: 4, code: '003005', name: 'Xem chi tiết', path: `/${ROUTE_PATH.BLOG_DETAIL}`}
    ]
  }
];