import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const filter = await FilterModel.deleteOne(data);
    return filter;
  } catch (err) {
    console.log(err);
  }
});
