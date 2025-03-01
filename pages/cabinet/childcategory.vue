<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
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
const config = useRuntimeConfig();
// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const fileUpload = ref([]);
const fileDelte = ref([]);
const form = ref({
  category: "",
  name: "",
  kirilica: "",
  icon: "",
  img: [],
  show_catalog: false,
});
const {
  data: filter,
  error,
  refresh,
} = await useFetch("/api/childcategory/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addUnit = async () => {
  const bodyFils = new FormData();
  let updateunit = "api/update/updatechildcategory";
  if (buttonEdit.value == true) {
    updateunit = "api/add/addchildcategory";
  } else {
    if (fileDelte.value.length != 0) {
      const responseDell = await $fetch("/api/deletefiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: { img: fileDelte.value },
      });
    }
  }
  const responseData = await $fetch(`/${updateunit}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (form.value.img.length != 0) {
    await $fetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    refresh();
    form.value = {
      category: "",
      name: "",
      kirilica: "",
      icon: "",
      img: [],
      show_catalog: false,
    };
    imfArr.value = [];
    form.value.description = "<p></p>";
  }
};
const drawerDel = async (id, img) => {
  dell.value = { _id: id };
  const responseData = await $fetch("/api/delete/deletechildcategory/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: dell.value,
  });

  let arrImg = [];
  for (let item in img) {
    if (img[item].name != undefined) {
      arrImg.push(img[item]);
    }
  }
  if (arrImg.length != 0) {
    const responseDell = await $fetch("/api/deletefiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { img: arrImg },
    });
  }

  if (responseData) {
    refresh();
  }
};

const drawerIn = (item) => {
  form.value.img = [];
  fileUpload.value = [];
  if (item.img.length) {
    form.value.img = item.img;
    imfArr.value = item.img;
  }
  (form.value._id = item._id),
    (form.value.category = item.category),
    (form.value.name = item.name),
    (form.value.show_catalog = item.show_catalog);
  (form.value.kirilica = item.kirilica),
    (form.value.icon = item.icon),
    (drawer.value = true);
  buttonEdit.value = false;
  fileDelte.value = [];
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  fileUpload.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "img") {
      form.value[item] = [];
    }
    if (item == "show_catalog") {
      form.value[item] = false;
    }
  }

  delete form.value["_id"];
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;
  refresh();
};
const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUpload.value.push(modifiedFile);
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemove = (file, fileList) => {
  form.value.img = [];
  fileDelte.value.push(file);
  form.value.img = imfArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelte.value = [];
  }
};
const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};
// const getFileList = () => {
//   const formattedFiles = imfArr.value.map((item) => ({
//     name: item.name,
//     url: `${config.public.urlHost}${item.url}`,
//   }));
//   return formattedFiles;
// };
</script>

<template>
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-9">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>ChildCategory</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить подкатегорию</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="filter.result" class="drawer-cat-all">
              <div class="drawer-cat" v-for="item in filter.result" :key="item">
                <div class="drawer-cat-left">
                  <div class="drawer-cat-img">
                    <NuxtImg
                      provider="aliyun"
                      v-if="item.img.length"
                      :src="item.img[0].url"
                      :alt="item.img[0].name"
                      format="wepb"
                    />
                    <img v-else src="/noimg.webp" />
                  </div>
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
                    @click="drawerDel(item._id, item.img)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <ClientOnly>
              <el-drawer
                v-model="drawer"
                :before-close="handleCloseDrawer"
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form @submit.prevent="addUnit">
                    <div class="field">
                      <el-select
                        v-model="form.category"
                        class=""
                        placeholder="category"
                        size="large"
                      >
                        <el-option
                          v-for="item in category"
                          :key="item.id_category"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-checkbox
                          v-model="form.show_catalog"
                          label="show catalog"
                          size="large"
                        />
                      </div>
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
                        <el-upload
                          class="upload-demo"
                          :before-upload="addImg"
                          :before-remove="beforeRemove"
                          drag
                          action="#"
                          multiple
                          :file-list="imfArr"
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
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="icon"
                          v-model="form.icon"
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
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="type"
                          v-model="form.type"
                        />
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
