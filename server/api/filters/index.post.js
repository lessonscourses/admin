import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await FilterModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await FilterModel.find().count();
      return { result, count };
    } else {
      const result = await FilterModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
