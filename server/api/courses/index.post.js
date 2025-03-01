import CoursesModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    if (data.ParamsCat) {
      let obj = { category: data.ParamsCat };
      const result = await CoursesModel.find(obj)
        .skip(data.sortPage)
        .limit(data.pageSize);

      const count = await CoursesModel.find(obj).count();
      return { result, count };
    }

    if (data != undefined && !data.ParamsCat) {
      const result = await CoursesModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await CoursesModel.find().count();
      return { result, count };
    } else {
      const result = await CoursesModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
