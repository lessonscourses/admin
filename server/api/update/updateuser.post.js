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

    // Обновляем или создаем запись в UserDataModel
    const userDataUpdateResult = await UserDataModel.findOneAndUpdate(
      userDataObj, // Условие поиска (ищем по id_user)
      { $set: userData }, // Обновляемые данные
      { upsert: true, new: true } // upsert создаст новую запись, если её нет
    );

    // Возвращаем результат обновления
    return { userUpdateResult, userDataUpdateResult };
  } catch (err) {
    console.error(err);
    throw createError({ statusCode: 500, message: "Ошибка обновления данных" });
  }
});
