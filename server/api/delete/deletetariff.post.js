import TariffsModel from "~/server/models/Tariffs";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const tarif = await TariffsModel.deleteOne(data);
    return tarif;
  } catch (err) {
    console.log(err);
  }
});
