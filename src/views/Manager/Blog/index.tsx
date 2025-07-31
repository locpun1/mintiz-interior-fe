// src/views/Manager/Blog/index.tsx
import { FC} from "react";


import Page from "@/components/Page";

import { useAppSelector } from "@/store";

import { ROLE } from "@/constants/roles";
import BlogPageManager from "./BlogPageManager";
import BlogPageEmployee from "./BlogPageEmployee";

const ManagementBlog: FC = () => {
  const { profile } = useAppSelector((state) => state.auth);

  return (
    <Page title="Quản lý bài viết">
      {profile?.role === ROLE.ADMIN ? (
        <BlogPageManager/>
      ) : (
        <BlogPageEmployee/>
      )}
    </Page>
  );
}

export default ManagementBlog;