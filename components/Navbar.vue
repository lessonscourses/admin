<script setup>
let Glitch;
const isGlitchLoaded = ref(false);

const { data: user, signOut } = useAuth();

const Exit = async () => {
  await signOut({ redirect: false });
  if (!useAuth().data.value) {
    return navigateTo("/");
  }
};

onMounted(async () => {
  ({ Glitch } = await import("vue-glitched"));

  isGlitchLoaded.value = true;
});
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="index-header">
          <div class="header-nav">
            <div class="header-logo">
              <nuxt-link to="/">
                <Glitch
                  v-if="isGlitchLoaded"
                  id="psychadelic"
                  fga="red"
                  fgb="blue"
                >
                  Admin
                </Glitch>
              </nuxt-link>
            </div>
            <div class="left-bar">
              <nuxt-link to="/">Главная</nuxt-link>
              <div class="left-bar-auth" v-if="user === null">
                <nuxt-link class="button is-primary" to="/login"
                  >Login</nuxt-link
                >
                <nuxt-link class="button is-primary" to="/registration"
                  >Registration</nuxt-link
                >
              </div>
              <div class="left-bar-auth" v-else>
                <nuxt-link to="/cabinet">Cabinet</nuxt-link>
                <button @click="Exit" class="button">Exit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
