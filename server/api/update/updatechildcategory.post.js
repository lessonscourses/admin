import ChildCategoryModel from "~/server/models/ChildCategory";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const cat = await ChildCategoryModel.replaceOne(obj, data);
    return cat;
  } catch (err) {
    console.log(err);
  }
});
