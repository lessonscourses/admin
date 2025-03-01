export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Код будет выполнен только в браузере
    import("vue-glitched").then(({ Glitch }) => {
      nuxtApp.vueApp.component("Glitch", Glitch);
    });
  }
});
