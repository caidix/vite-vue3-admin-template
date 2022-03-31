import Layout from "/@/layout/index.vue";

const dashboard = {
  path: "/dashboard",
  name: "Dashboard",
  component: Layout,
  redirect: "/dashboard3",
  meta: {
    icon: "dashboard",
    showLink: true,
    i18n: true,
    rank: 0,
    title: "呜呜呜"
  },
  children: [
    {
      path: "/dashboard3",
      name: "dashboard3",
      component: () => import("/@/views/dashboard/index.vue"),
      meta: {
        title: "看板3",
        i18n: true,
        showLink: true
      }
    },
    {
      path: "/dashboard4",
      name: "dashboard4",
      component: () => import("/@/views/dashboard/index.vue"),
      meta: {
        title: "看板4",
        i18n: true,
        showLink: true
      }
    }
  ]
};

export default dashboard;
