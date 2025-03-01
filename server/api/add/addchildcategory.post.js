import ChildCategoryModel from "~/server/models/ChildCategory";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const category = await ChildCategoryModel.create(data);
    return category;
  } catch (err) {
    console.log(err);
  }
});
