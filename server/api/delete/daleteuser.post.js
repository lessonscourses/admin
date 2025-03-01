import UserModel from "~/server/models/User";
import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    // Удаляем пользователя из коллекции UserModel
    const user = await UserModel.deleteOne({ _id: data });

    // Удаляем связанные данные из коллекции UserDataModel
    const userDataObj = { id_user: data };
    const userData = await UserDataModel.deleteOne(userDataObj);

    return user;
  } catch (err) {
    console.log(err);
  }
});
