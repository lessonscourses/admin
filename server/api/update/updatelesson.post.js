import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const lesson = await LessonModel.replaceOne(obj, data);
    return lesson;
  } catch (err) {
    console.log(err);
  }
});
