import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView
    },
    {
      path: "/feedback",
      name: "feedback",
      component: () => import("../views/FeedbackView.vue")
    },
    {
      // Bookmarks used to be a virtual category, keep its old address working
      path: "/category/bookmarks",
      redirect: {name: "list", params: {listId: "bookmarks"}}
    },
    {
      path: "/category/:categoryName",
      name: "category",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CategoryView.vue")
    },
    {
      path: "/lists",
      name: "lists",
      component: () => import("../views/ListsView.vue")
    },
    {
      path: "/list/:listId",
      name: "list",
      component: () => import("../views/ListView.vue")
    },
    {
      path: "/list/:listId/add",
      name: "list-add",
      component: () => import("../views/ListAddView.vue")
    },
    {
      path: "/prayer/view/:lang/:prayerId",
      name: "view-prayer",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/PrayerView.vue")
    },
    {
      path: "/prayer/add/",
      name: "add-prayer",
      component: () => import("../views/AddPrayerView.vue")
    },
    {
      path: "/prayer/edit/:prayerId",
      name: "edit-prayer",
      component: () => import("../views/EditPrayerView.vue")
    }
  ]
});

export default router;
