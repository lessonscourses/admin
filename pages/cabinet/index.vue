<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});

// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const form = ref({
  email: "",
  username: "",
  password: "",
  id_user: "",
  userData: [
    {
      date_registration: "",
      activation_date: "",
      activation_get: "",
      img: [],
      status: false,
      blocking: false,
      verification: false,
    },
  ],
});
const {
  data: users,
  error,
  refresh,
} = await useFetch("/api/users/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addUser = async () => {
  let updatecat = "api/update/updateuser";
  console.log(form.value);
  if (buttonEdit.value == true) {
    updatecat = "api/add/addcategory";
  }
  const { data: responseData } = await useFetch(`/${updatecat}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    refresh();
    form.value = {
      email: "",
      username: "",
      password: "",
      id_user: "",
      userData: [
        {
          date_registration: "",
          activation_date: "",
          activation_get: "",
          img: [],
          status: false,
          blocking: false,
          verification: false,
        },
      ],
    };
    imfArr.value = [];
    if (form.value.userData[0].img.length > 0) {
      form.value.userData[0].img = [];
    }
  }
};
const drawerDel = async (id) => {
  dell.value = id;

  const responseData = await $fetch("/api/delete/daleteuser/", {
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
  form.value._id = item._id;
  (form.value.email = item.email),
    (form.value.password = item.password),
    (form.value.username = item.username),
    (imfArr.value = []);

  if (item.userData && item.userData.length > 0) {
    for (let itemIn in item.userData[0]) {
      form.value.userData[0][itemIn] = item.userData[0][itemIn];
      if (itemIn == "date_registration") {
        form.value.userData[0][itemIn] = timeFun(item.userData[0][itemIn]);
        console.log(form.value.userData[0][itemIn]);
      }
    }
    if (form.value.userData[0].img.length > 0) {
      form.value.userData[0].img = item.userData[0].img;
      imfArr.value = item.userData[0].img;
    }
  }

  drawer.value = true;
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = {};
};
const addImg = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.userData[0].img.push({
      name: file.name,
      url: event.target.result,
    });
  };
  reader.readAsDataURL(file);
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 10 - 10;
  }
  currentPage.value = val;
  refresh();
};

const timeFun = (newValue) => {
  const currentDate = new Date(newValue);
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const formattedDateTime = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
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
