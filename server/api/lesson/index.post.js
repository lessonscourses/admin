import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await LessonModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await LessonModel.find().count();
      return { result, count };
    } else {
      const result = await LessonModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
