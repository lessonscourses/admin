import TariffsModel from "~/server/models/Tariffs";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const tarif = await TariffsModel.replaceOne(obj, data);
    return tarif;
  } catch (err) {
    console.log(err);
  }
});
