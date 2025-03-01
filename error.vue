<script setup>
const goBack = () => {
  navigateTo({ path: "/" });
};
</script>
<template>
  <div>
    <NuxtLayout name="404">
      <div id="notfound">
        <div class="notfound">
          <div class="notfound-404">
            <h1>4<span></span>4</h1>
          </div>
          <h2>Oops! Page Not Be Found</h2>
          <p>
            Sorry but the page you are looking for does not exist, have been
            removed. name changed or is temporarily unavailable
          </p>
          <button class="button" @click="goBack">Back to homepage</button>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
