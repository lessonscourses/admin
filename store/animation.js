import { defineStore } from "pinia";

export const animationStore = defineStore("animation", {
  state: () => ({
    animationData: {},
    isLoaded: false, // Флаг, указывающий, были ли данные уже загружены
    animationDataContact: {},
    isLoadedContact: false, // Флаг, указывающий, были ли данные уже загружены
  }),
  getters: {
    getAnimationData: (state) => state.animationData,
  },
  actions: {
    setAnimationData(data) {
      this.animationData = data;
      this.isLoaded = true; // Устанавливаем флаг, что данные были загружены
    },
    setAnimationDataContact(data) {
      this.animationDataContact = data;
      this.isLoadedContact = true; // Устанавливаем флаг, что данные были загружены
    },
  },
  persist: true,
});
