import CoursesModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const result = await CoursesModel.find()
      .select("kirilica title")
      .skip(data.sortPage)
      .limit(data.pageSize);

    const count = await CoursesModel.find().count();
    return { result, count };
  } catch (err) {
    console.log(err);
  }
});
