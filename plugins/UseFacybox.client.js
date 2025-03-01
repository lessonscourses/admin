import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default defineNuxtPlugin((nuxtApp) => {
  const fancyboxInstance = Fancybox.bind("[data-fancybox]");

  // Добавляем метод close в объект fancyboxInstance
  const closeFancybox = () => {
    fancyboxInstance.close();
  };

  // Предоставляем fancyboxInstance в качестве провайдера
  nuxtApp.provide("fancybox", {
    instance: fancyboxInstance,
    close: closeFancybox,
  });
});
