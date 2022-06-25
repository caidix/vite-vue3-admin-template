import Layout from "/@/layout/index.vue";

const error = {
  path: "/error",
  name: "Error",
  component: Layout,
  redirect: "/error/403",
  meta: {
    icon: "dashboard",
    showLink: false,
    i18n: true,
    rank: 0
  },
  children: [
    {
      path: "/error/404",
      name: "404",
      component: () => import("/@/views/error/404.vue"),
      meta: {
        title: 404,
        showLink: false
      }
    }
  ]
};

export default error;
