<script setup>
definePageMeta({
  middleware: "auth",
  layout: "custom",
});
const { data: category } = await useFetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { data: childcategory } = await useFetch("/api/childcategory/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const type = ref(["Продолжительность", "Язык", "Цена"]);
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const form = ref({
  name: "",
  kirilica: "",
  type: ["продолжительность", "Язык", "Цена"],
  category: "",
  childcategory: "",
});
const {
  data: filter,
  error,
  refresh,
} = await useFetch("/api/filters/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addFilter = async () => {
  let updatefilter = "api/update/updatefilter";
  if (buttonEdit.value == true) {
    updatefilter = "api/add/addfilter";
  }
  const responseData = await $fetch(`/${updatefilter}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    refresh();
    form.value = {};
  }
};
const drawerDel = async (id) => {
  dell.value = { _id: id };
  const responseData = await $fetch("/api/delete/deletefilter/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: dell.value,
  });
  if (responseData) {
    refresh();
  }
};
const drawerIn = (item) => {
  (form.value._id = item._id),
    (form.value.category = item.category),
    (form.value.childcategory = item.childcategory),
    (form.value.name = item.name),
    (form.value.kirilica = item.kirilica),
    (form.value.type = item.type),
    (drawer.value = true);
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = {};
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 4 - 4;
  }
  currentPage.value = val;
  refresh();
};
</script>

<template>
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-9">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Filter</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить фильтр</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="filter.result" class="drawer-cat-all">
              <div class="drawer-cat" v-for="item in filter.result" :key="item">
                <div class="drawer-cat-left">
                  <strong>{{ item.name }}</strong>
                </div>

                <div class="drawer-cat-right">
                  <button
                    class="button is-warning is-normal is-light"
                    type="submit"
                    @click="drawerIn(item)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-danger is-normal is-light"
                    type="submit"
                    @click="drawerDel(item._id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <ClientOnly>
              <el-drawer
                v-model="drawer"
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form @submit.prevent="addFilter">
                    <div class="field">
                      <el-select
                        v-model="form.category"
                        class=""
                        placeholder="category"
                        size="large"
                      >
                        <el-option
                          v-for="item in category"
                          :key="item._id"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <el-select
                        v-model="form.childcategory"
                        class=""
                        placeholder="category"
                        size="large"
                      >
                        <el-option
                          v-for="item in childcategory"
                          :key="item._id"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <el-select
                        v-model="form.type"
                        class=""
                        placeholder="type"
                        size="large"
                      >
                        <el-option
                          v-for="item in type"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="name"
                          v-model="form.name"
                        />
                      </div>
                    </div>

                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="kirilica"
                          v-model="form.kirilica"
                        />
                      </div>
                    </div>
                    <!-- <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="type"
                          v-model="form.type"
                        />
                      </div>
                    </div> -->
                    <div class="field">
                      <div class="control">
                        <button
                          v-if="buttonEdit == true"
                          class="button is-success"
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          v-else
                          class="button is-success"
                          type="submit"
                          @click="drawer = false"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </el-drawer>
            </ClientOnly>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filter.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-3">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
