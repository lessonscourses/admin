import ChildCategoryModel from "~/server/models/ChildCategory";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const cat = await ChildCategoryModel.deleteOne(data);
    return cat;
  } catch (err) {
    console.log(err);
  }
});
