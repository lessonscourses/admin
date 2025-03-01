<script setup>
definePageMeta({
  middleware: "guest",
});
const form = ref({
  email: "",
  username: "",
  password: "",
});
const handleFromSubmit = async () => {
  try {
    await useFetch("/api/auth/registr", {
      method: "POST",
      body: form.value,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="container">
    <h1>Reg</h1>
    <form @submit.prevent="handleFromSubmit">
      <input type="email" placeholder="Email" v-model="form.email" />
      <input type="text" placeholder="UserName" v-model="form.username" />
      <input type="password" placeholder="Password" v-model="form.password" />
      <button type="submit">Registr</button>
    </form>
  </div>
</template>
