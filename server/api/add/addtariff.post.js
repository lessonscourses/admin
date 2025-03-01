import TariffsModel from "~/server/models/Tariffs";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const teriff = await TariffsModel.create(data);
    return teriff;
  } catch (err) {
    console.log(err);
  }
});
