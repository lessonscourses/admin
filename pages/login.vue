<script setup>
definePageMeta({
  middleware: "guest",
  layout: "default",
});
const progress = ref(0);
const form = ref({
  username: "",
  password: "",
});

const { signIn } = useAuth();

const handleLogin = async (e) => {
  e.preventDefault();
  const res = await signIn("credentials", { redirect: false, ...form.value });
  console.log(res);
  if (res.url != null) {
    useRouter().push({
      name: "cabinet",
    });
  }
};
</script>
<template>
  <div class="container">
    <div class="content">
      <h1>login</h1>

      <div class="columns">
        <div class="column is-5">
          <form @submit.prevent="handleLogin">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="UserName"
                  v-model="form.username"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="password"
                  placeholder="Password"
                  v-model="form.password"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-success" type="submit">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
