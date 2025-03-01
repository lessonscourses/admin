import UserModel from "~/server/models/User";
import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  try {
    // Получаем данные из запроса
    const data = await readBody(event);

    // Создаем объект для поиска пользователя по его _id
    const userObj = { _id: data._id };
    const userDataObj = { id_user: data._id }; // Используем id_user для поиска userData
    const userData = data.userData[0]; // Получаем первый элемент из массива userData

    // Обновляем данные пользователя в UserModel
    const userUpdateResult = await UserModel.replaceOne(userObj, data);

    // Используем id_user для поиска userData
    const userDataUpdateResult = await UserDataModel.replaceOne(
      userDataObj,
      userData
    );

    // Возвращаем результат обновления пользователя в UserModel
    return userUpdateResult;
  } catch (err) {
    console.log(err);
  }
});
