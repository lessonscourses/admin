import CategoryModel from "~/server/models/Category";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const category = await CategoryModel.create(data);
    return category;
  } catch (err) {
    console.log(err);
  }
});
