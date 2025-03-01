import CoursesModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const cat = await CoursesModel.replaceOne(obj, data);
    return cat;
  } catch (err) {
    console.log(err);
  }
});
