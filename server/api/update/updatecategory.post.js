import CategoryModel from "~/server/models/Category";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const cat = await CategoryModel.replaceOne(obj, data);
    return cat;
  } catch (err) {
    console.log(err);
  }
});
