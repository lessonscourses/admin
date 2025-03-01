import VueRewards from "vue-rewards";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueRewards);
});
