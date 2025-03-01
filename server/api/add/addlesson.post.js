import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const lesson = await LessonModel.create(data);
    return lesson;
  } catch (err) {
    console.log(err);
  }
});
