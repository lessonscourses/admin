import TariffsModel from "~/server/models/Tariffs";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await TariffsModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await TariffsModel.find().count();
      return { result, count };
    } else {
      const result = await TariffsModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
