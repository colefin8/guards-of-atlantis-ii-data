import { createRouter, createWebHistory } from "vue-router";
import CharacterList from "@/pages/CharacterList.vue";
import CharacterDetails from "@/pages/CharacterDetails.vue";
import GydionSpells from "@/pages/GydionSpells.vue";

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
    {
      path: "/character/Gydion/spells",
      name: "GydionSpells",
      component: GydionSpells,
    },
  ],
});

export default router;
