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
  name: "",
  mount: "",
  price: "",
  currency: "",
  link: "",
  icon: [],
});
const {
  data: tariffs,
  error,
  refresh,
} = await useFetch("/api/tariffs/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addTarif = async () => {
  let updatecat = "api/update/updatetariff";
  if (buttonEdit.value == true) {
    updatecat = "api/add/addtariff";
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
      name: "",
      mount: "",
      price: "",
      currency: "",
      link: "",
      icon: [],
    };
    imfArr.value = [];
    form.value.icon = [];
  }
};
const drawerDel = async (id) => {
  dell.value = { _id: id };
  const { data: responseData } = await useFetch("/api/delete/deletetariff/", {
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
  console.log(item);
  form.value._id = item._id;
  (form.value.id_user = item.id_user),
    (form.value.name = item.name),
    (imfArr.value = []);
  if (item.icon.length) {
    form.value.icon = item.icon;
    imfArr.value = item.icon;
  }
  (form.value.mount = item.mount),
    (form.value.mount = item.mount),
    (form.value.price = item.price),
    (form.value.currency = item.currency),
    (form.value.link = item.link),
    (drawer.value = true);
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = {
    name: "",
    mount: "",
    price: "",
    currency: "",
    link: "",
    icon: [],
  };
  imfArr.value = [];
};
const addImg = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.icon.push({ name: file.name, url: event.target.result });
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
</script>

<template>
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-9">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Tariffs</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить тариф</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="tariffs.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in tariffs.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <div class="drawer-cat-img">
                    <img
                      v-for="iconurl in item.icon"
                      :key="iconurl"
                      :src="iconurl.url"
                    />
                  </div>
                  <strong>{{ item.name }}</strong>
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
                  <form @submit.prevent="addTarif">
                    <div
                      class="field"
                      v-for="(item, index) in form"
                      :key="index"
                    >
                      <div
                        class="field"
                        v-show="index != '__v' && index != '_id'"
                        v-if="index != 'img'"
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

                      <div class="field" v-if="index == 'icon'">
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
                              Drop icon here or <em>click to upload </em>
                            </div>
                          </el-upload>
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
          :total="tariffs.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-3">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
