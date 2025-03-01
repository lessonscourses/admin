<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});
const { data: filter } = await useFetch("/api/filters/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const config = useRuntimeConfig();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const galArr = ref([]);
const categoryUse = ref([]);
const fileUpload = ref([]);
const fileUploadImg = ref([]);
const fileUploadGalery = ref([]);
const fileDelteGalery = ref([]);
const fileDelteImg = ref([]);
const fileDelte = ref([]);

const form = ref({
  category: "",
  categorychild: "",
  title: "",
  preview: "",
  kirilica: "",
  img: [],
  galery: [],
  filter: [],
  duration: "",
  number_of_lessons: "",
  release_date: "",
  description: "",
  language: "",
  raiting: "",
  show_new: false,
  show_top: false,
  show_catalog: false,
});

const { data: category } = await useFetch(() => "/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { data: categorychild } = await useFetch(() => "/api/childcategory/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const {
  data: project,
  error,
  refresh,
} = await useFetch("/api/courses/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});

const addProject = async () => {
  const bodyFils = new FormData();
  fileDelte.value = fileDelteImg.value.concat(fileDelteGalery.value);
  let updateproject = "api/update/updatecourses";
  if (buttonEdit.value == true) {
    updateproject = "api/add/addcourses";
  } else {
    if (fileDelte.value.length != 0) {
      const { data: responseDell } = await useFetch("/api/deletefiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: { img: fileDelte.value },
      });
    }
  }
  const responseData = await $fetch(`/${updateproject}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  fileUpload.value = fileUploadImg.value.concat(fileUploadGalery.value);
  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (fileUpload.value.length != 0) {
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
      categorychild: "",
      title: "",
      preview: "",
      kirilica: "",
      img: [],
      galery: [],
      filter: [],
      duration: "",
      number_of_lessons: "",
      release_date: "",
      description: "",
      language: "",
      raiting: "",
      show_new: false,
      show_top: false,
      show_catalog: false,
    };
    imfArr.value = [];
    galArr.value = [];
    form.value.description = "<p></p>";
  }
};

const drawerDel = async (id, img, galey) => {
  let arrFiles = [];
  let arrContact = [];
  if (img != undefined && galey != undefined) {
    arrContact = img.concat(galey);
  } else if (img != undefined && galey == undefined) {
    arrContact = img;
  } else if (img == undefined && galey != undefined) {
    arrContact = galey;
  }
  for (let item in arrContact) {
    if (arrContact[item].name != undefined) {
      arrFiles.push(arrContact[item]);
    }
  }
  if (arrFiles.length != 0) {
    const responseDell = await $fetch("/api/deletefiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { img: arrFiles },
    });
  }
  dell.value = { _id: id };
  const responseData = await $fetch("/api/delete/deletecourses/", {
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
  form.value.img = [];
  form.value.galery = [];
  fileUploadImg.value = [];
  fileUploadGalery.value = [];
  if (item.img.length) {
    form.value.img = item.img;
    imfArr.value = item.img;
  }
  if (item.galery.length) {
    form.value.galery = item.galery;
    galArr.value = item.galery;
  }
  form.value._id = item._id;
  form.value.show_catalog = item.show_catalog;
  form.value.category = item.category;
  (form.value.categorychild = item.categorychild),
    (form.value.kirilica = item.kirilica),
    (form.value.filter = item.filter),
    (form.value.title = item.title),
    (form.value.preview = item.preview),
    (form.value.duration = item.duration),
    (form.value.number_of_lessons = item.number_of_lessons),
    (form.value.description = item.description),
    (form.value.release_date = item.release_date),
    (form.value.language = item.language),
    (form.value.raiting = item.raiting),
    (form.value.show_new = item.show_new),
    (form.value.show_top = item.show_top),
    (drawer.value = true);
  buttonEdit.value = false;
  fileDelteImg.value = [];
  fileDelteGalery.value = [];
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  galArr.value = [];
  fileUploadImg.value = [];
  fileUploadGalery.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "description") {
      form.value[item] = "<p></p>";
    }
    if (item == "img" || item == "galery" || item == "filter") {
      form.value[item] = [];
    }
    if (item == "show_new" || item == "show_top" || item == "show_catalog") {
      form.value[item] = false;
    }
  }

  delete form.value["_id"];
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

const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadImg.value.push(modifiedFile);
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};
const addGal = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadGalery.value.push(modifiedFile);
  form.value.galery.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemoveImg = (file, fileList) => {
  removeFilesAll("img", file, fileList);
};
const beforeRemoveGal = (file, fileList) => {
  removeFilesAll("galery", file, fileList);
};
const removeFilesAll = (nameFun, file, fileList) => {
  form.value.nameFun = [];
  form.value.nameFun = imfArr.value;
  if (nameFun == "img") {
    fileDelteImg.value.push(file);
    if (file.size != undefined && fileList.length == 1) {
      fileDelteImg.value = [];
    }
  } else if (nameFun == "galery") {
    fileDelteGalery.value.push(file);
    if (file.size != undefined && fileList.length == 1) {
      fileDelteGalery.value = [];
    }
  }
};

const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};
</script>

<template>
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-9">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Project</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить проект</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="project.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in project.result"
                :key="item"
              >
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
                  <!-- <span>{{ item.category }}</span> -->
                  <strong>{{ item.title }}</strong>
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
                    @click="drawerDel(item._id, item.img, item.galery)"
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
                  <form @submit.prevent="addProject">
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
                      <el-select
                        v-model="form.categorychild"
                        class=""
                        placeholder="child category"
                        size="large"
                      >
                        <el-option
                          v-for="item in categorychild"
                          :key="item._id"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <el-select
                        v-model="form.filter"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="Фильтр"
                        value-key="_id"
                      >
                        <el-option
                          v-for="item in filter"
                          :key="item._id"
                          :label="item.name"
                          :value="item"
                        >
                        </el-option>
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
                        <el-checkbox
                          v-model="form.show_new"
                          label="show new"
                          size="large"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-checkbox
                          v-model="form.show_top"
                          label="show top"
                          size="large"
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
                          placeholder="title"
                          v-model="form.title"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="preview"
                          v-model="form.preview"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-upload
                          class="upload-demo"
                          :before-upload="addImg"
                          :before-remove="beforeRemoveImg"
                          drag
                          action="#"
                          multiple
                          list-type="picture"
                          v-model:file-list="imfArr"
                          :limit="1"
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
                    <!-- <div class="field">
                      <div class="control">
                        <el-upload
                          class="upload-demo"
                          :before-upload="addGal"
                          :before-remove="beforeRemoveGal"
                          drag
                          action="#"
                          multiple
                          list-type="picture"
                          v-model:file-list="galArr"
                          :limit="10"
                        >
                          <el-icon class="el-icon--upload"
                            ><upload-filled
                          /></el-icon>
                          <div class="el-upload__text">
                            Drop img galery here or <em>click to upload </em>
                          </div>
                        </el-upload>
                      </div>
                    </div> -->

                    <div class="field">
                      <div class="control">
                        <textarea
                          class="textarea"
                          placeholder="info"
                          v-model="form.info"
                          rows="4"
                        >
                        </textarea>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="duration"
                          v-model="form.duration"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="number of lessons"
                          v-model="form.number_of_lessons"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="release date"
                          v-model="form.release_date"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="language"
                          v-model="form.language"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="number"
                          placeholder="raiting"
                          v-model="form.raiting"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div class="field">
                      <div class="control">
                        <QuillEditor
                          v-model:content="form.description"
                          contentType="html"
                          toolbar="full"
                          theme="snow"
                        ></QuillEditor>
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
                          class="button is-success mt-6"
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
          :total="project.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-3">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
