import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const lesson = await LessonModel.deleteOne(data);
    return lesson;
  } catch (err) {
    console.log(err);
  }
});
