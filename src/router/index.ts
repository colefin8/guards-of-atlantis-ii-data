import { createRouter, createWebHistory } from "vue-router";
import CharacterList from "@/pages/CharacterList.vue";
import CharacterDetails from "@/pages/CharacterDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "CharacterList",
      component: CharacterList,
    },
    {
      path: "/character/:name",
      name: "CharacterDetails",
      component: CharacterDetails,
    },
  ],
});

export default router;
