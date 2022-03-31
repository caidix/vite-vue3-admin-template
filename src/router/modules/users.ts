import Layout from "/@/layout/index.vue";

const users = {
  path: "/users",
  name: "users",
  component: Layout,
  redirect: "/users/index",
  meta: {
    icon: "dashboard",
    showLink: true,
    i18n: true,
    rank: 0
  },
  children: [
    {
      path: "index",
      name: "UserPage",
      component: () => import("/@/views/users/index.vue"),
      meta: {
        title: "用户管理",
        i18n: true,
        showLink: true
      }
    }
  ]
};

export default users;
