<script setup>
const { data: user, signOut } = useAuth();

const Exit = async () => {
  await signOut({ redirect: false });
  if (!useAuth().data.value) {
    return navigateTo("/");
  }
};
</script>

<template>
  <div class="meny-cabinet">
    <aside class="menu">
      <p class="menu-label">Meny</p>
      <ul class="menu-list">
        <li><nuxt-link to="/cabinet/">Main</nuxt-link></li>
        <li><nuxt-link to="/cabinet/category">Category</nuxt-link></li>
        <li>
          <nuxt-link to="/cabinet/childcategory">ChildCategory</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cabinet/courses">Courses</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cabinet/lesson">Lesson</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cabinet/lesson_parsing">Lesson parsing</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cabinet/filter">Filter</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cabinet/tariffs">Tariffs</nuxt-link>
        </li>
      </ul>
    </aside>
  </div>
</template>
