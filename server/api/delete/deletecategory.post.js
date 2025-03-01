import CategoryModel from "~/server/models/Category";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const cat = await CategoryModel.deleteOne(data);
    return cat;
  } catch (err) {
    console.log(err);
  }
});
