import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const fillter = await FilterModel.replaceOne(obj, data);
    return fillter;
  } catch (err) {
    console.log(err);
  }
});
