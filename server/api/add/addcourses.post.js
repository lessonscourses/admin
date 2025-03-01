import CoursesModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const courses = await CoursesModel.create(data);
    return courses;
  } catch (err) {
    console.log(err);
  }
});
