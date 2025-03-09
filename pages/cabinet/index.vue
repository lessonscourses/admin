<script setup>
import { UploadFilled } from "@element-plus/icons-vue";

definePageMeta({
  middleware: "auth",
  layout: "custom",
});

const sortPage = computed(() => (currentPage.value - 1) * pageSize.value);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const form = ref(getEmptyForm());

const { data: users, refresh } = await useFetch("/api/users/", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
  body: { sortPage, pageSize },
});

async function addUser() {
  const url = buttonEdit.value
    ? "/api/add/addcategory"
    : "/api/update/updateuser";
  const { data: responseData } = await useFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: form.value,
  });

  if (responseData) {
    refresh();
    form.value = getEmptyForm();
  }
}

async function drawerDel(id) {
  const responseData = await $fetch("/api/delete/daleteuser/", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: { _id: id },
  });

  if (responseData) refresh();
}

function drawerIn(item) {
  form.value = {
    email: item.email || "",
    username: item.username || "",
    password: item.password || "",
    id_user: item.id_user || "",
    _id: item._id,
    userData: [getUserData(item?.userData?.[0])],
  };

  imfArr.value = form.value.userData[0].img;
  drawer.value = true;
  buttonEdit.value = false;
}

function getUserData(data = {}) {
  return {
    date_registration: data.date_registration
      ? new Date(data.date_registration)
      : null,
    activation_date: data.activation_date
      ? new Date(data.activation_date)
      : null,
    activation_get: data.activation_get ? new Date(data.activation_get) : null,
    img: data.img || [],
    status: data.status || false,
    blocking: data.blocking || false,
    verification: data.verification || false,
  };
}
function drawerNull() {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = getEmptyForm();
}

function addImg(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.userData[0].img.push({
      name: file.name,
      url: event.target.result,
    });
  };
  reader.readAsDataURL(file);
}

function getEmptyForm() {
  return {
    email: "",
    username: "",
    password: "",
    id_user: "",
    userData: [getUserData()],
  };
}
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 10 - 10;
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
            <h1>Users</h1>
            <!-- <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить категорию</span>
            </button> -->
          </div>
          <div class="drawer-add">
            <div v-if="users.result" class="drawer-cat-all">
              <div class="drawer-cat" v-for="item in users.result" :key="item">
                <div class="drawer-cat-left">
                  <div
                    class="drawer-cat-img"
                    v-if="
                      item.userData &&
                      item.userData.length > 0 &&
                      item.userData[0].img.length
                    "
                  >
                    <img
                      v-for="imgurl in item.userData[0].img"
                      :key="imgurl"
                      :src="imgurl.url"
                    />
                  </div>
                  <div v-else class="drawer-cat-img">
                    <img src="/noimg.webp" />
                  </div>
                  <span>{{ item.id_user }}</span>
                  <strong>{{ item.username }}</strong>
                </div>
                <!-- <span>{{ item.kirilica }}</span>   
                           <span>{{ item.description }}</span> -->
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
                  <form @submit.prevent="addUser">
                    <div
                      class="field"
                      v-for="(item, index) in form"
                      :key="index"
                    >
                      <div
                        class="field"
                        v-show="index != '__v' && index != '_id'"
                        v-if="
                          index == 'email' ||
                          index == 'username' ||
                          index == 'password'
                        "
                      >
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            :placeholder="index"
                            v-model="form[index]"
                          />
                        </div>
                      </div>
                      <div v-if="index == 'userData'">
                        <div
                          class="field"
                          v-for="(itemIn, indexIn) in form[index][0]"
                          :key="indexIn"
                          v-show="
                            indexIn != '__v' &&
                            indexIn != '_id' &&
                            indexIn != 'id_user'
                          "
                        >
                          <div
                            v-if="
                              indexIn != 'status' &&
                              indexIn != 'verification' &&
                              indexIn != 'blocking' &&
                              indexIn != 'img'
                            "
                            class="field"
                          >
                            <div class="control">
                              <input
                                class="input"
                                type="text"
                                :placeholder="indexIn"
                                v-model="form[index][0][indexIn]"
                              />
                            </div>
                          </div>
                          <div
                            class="field"
                            v-if="
                              indexIn == 'status' ||
                              indexIn == 'verification' ||
                              indexIn == 'blocking'
                            "
                          >
                            <div class="control">
                              <el-checkbox
                                v-model="form[index][0][indexIn]"
                                :label="indexIn"
                                size="large"
                              />
                            </div>
                          </div>

                          <div class="field" v-if="indexIn == 'img'">
                            <div class="control">
                              <el-upload
                                class="upload-demo"
                                :before-upload="addImg"
                                drag
                                action="#"
                                multiple
                                list-type="picture"
                                v-model:file-list="imfArr"
                              >
                                <el-icon class="el-icon--upload"
                                  ><upload-filled
                                /></el-icon>
                                <div class="el-upload__text">
                                  Drop img here or <em>click to upload </em>
                                </div>
                              </el-upload>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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
          :total="users.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-3">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
