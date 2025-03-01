<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});

const config = useRuntimeConfig();
// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const videoArr = ref([]);
const fileUpload = ref([]);
const fileDelte = ref([]);

const courses = ref([]);
const lessons = ref({});

const form = ref({
  course: "",
  name: "",
  number: "",
  lesson_number: "",
  time: "",
  description: "",
  video: [],
});

const { data: coursesData } = await useFetch("/api/courseslesson/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});

const {
  data: lessonsData,
  error,
  refresh,
} = await useFetch("/api/lesson/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const addUnit = async () => {
  const bodyFils = new FormData();
  let updateunit = "api/update/updatelesson";
  if (buttonEdit.value == true) {
    updateunit = "api/add/addlesson";
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
  if (form.value.video.length != 0) {
    await $fetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    refresh();
    form.value = {
      course: "",
      name: "",
      number: "",
      lesson_number: "",
      link_video: "",
      time: "",
      description: "",
      video: [],
    };
    videoArr.value = [];
    form.value.description = "<p></p>";
  }
};
const drawerDel = async (id, video) => {
  let arrVideo = [];
  for (let item in video) {
    if (video[item].name != undefined) {
      arrVideo.push(video[item]);
    }
  }
  if (arrVideo.length != 0) {
    const responseDell = await $fetch("/api/deletefiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { img: arrVideo },
    });
  }
  dell.value = { _id: id };
  const responseData = await $fetch("/api/delete/deletelesson/", {
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
  form.value.video = [];
  fileUpload.value = [];
  if (item.video.length) {
    form.value.video = item.video;
    videoArr.value = item.video;
  }
  (form.value._id = item._id),
    (form.value.course = item.course),
    (form.value.name = item.name),
    (form.value.number = item.number),
    (form.value.lesson_number = item.lesson_number),
    (form.value.link_video = item.link_video),
    (form.value.time = item.time),
    (drawer.value = true);
  buttonEdit.value = false;
  fileDelte.value = [];
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  videoArr.value = [];
  fileUpload.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "video") {
      form.value[item] = [];
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
const addVideo = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;
  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.raw.type,
  });

  fileUpload.value.push(modifiedFile);
  console.log(fileUpload.value);
  form.value.video.push({
    name: modifiedFile.name,
    url: `${config.public.filesPathVideo}${modifiedFile.name}`,
  });
};

const beforeRemove = (file, fileList) => {
  form.value.video = [];
  fileDelte.value.push(file);
  form.value.video = videoArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelte.value = [];
  }
};
const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};

// Группировка уроков по курсам
const coursesWithLessons = computed(() => {
  if (!coursesData.value || !lessonsData.value) return [];

  const lessonsByCourse = lessonsData.value.reduce((acc, lesson) => {
    if (!acc[lesson.course]) {
      acc[lesson.course] = [];
    }
    acc[lesson.course].push(lesson);
    return acc;
  }, {});

  return coursesData.value.result.map((course) => {
    return {
      ...course,
      lessons: lessonsByCourse[course.kirilica] || [],
    };
  });
});
</script>

<template>
  <div class="container is-max-desktop">
    <div class="columns">
      <div class="column is-9">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Lesson</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить урок</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="coursesWithLessons" class="drawer-cat-all">
              <el-collapse>
                <el-collapse-item
                  v-for="(course, index) in coursesWithLessons"
                  :key="index"
                  :title="course.title"
                >
                  <div>
                    <div
                      class="drawer-cat"
                      v-for="lesson in course.lessons"
                      :key="lesson._id"
                    >
                      <div class="drawer-cat-left">
                        <div class="drawer-cat-img">
                          <img src="/noimg.webp" />
                        </div>
                        <span>{{ lesson.number }}</span>
                        <strong>{{ lesson.name }}</strong>
                      </div>

                      <div class="drawer-cat-right">
                        <button
                          class="button is-warning is-normal is-light"
                          type="submit"
                          @click="drawerIn(lesson)"
                        >
                          Edit
                        </button>
                        <button
                          class="button is-danger is-normal is-light"
                          type="submit"
                          @click="drawerDel(lesson._id, lesson.video)"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
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
                        v-model="form.course"
                        class=""
                        placeholder="course"
                        size="large"
                      >
                        <el-option
                          v-for="item in coursesData.result"
                          :key="item._id"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="number"
                          v-model="form.number"
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
                          :on-change="addVideo"
                          :before-remove="beforeRemove"
                          drag
                          action=""
                          :auto-upload="false"
                          v-model:file-list="videoArr"
                        >
                          <el-icon class="el-icon--upload"
                            ><upload-filled
                          /></el-icon>
                          <div class="el-upload__text">
                            Drop video here or <em>click to upload </em>
                          </div>
                        </el-upload>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="lesson number"
                          v-model="form.lesson_number"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="time"
                          v-model="form.time"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="link video"
                          v-model="form.link_video"
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
          :total="coursesData.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-3">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
