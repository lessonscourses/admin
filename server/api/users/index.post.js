import UserModel from "~/server/models/User";
import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const finduser = await UserModel.find()
      .lean()
      .skip(data.sortPage)
      .limit(data.pageSize);

    // Получаем данные пользователя из UserDataModel для каждого пользователя
    const result = await Promise.all(
      finduser.map(async (user) => {
        // Создаем объект для запроса данных пользователя
        const obj = { id_user: user._id };

        // Получаем данные пользователя из UserDataModel
        const userData = await UserDataModel.find(obj);

        // Добавляем данные пользователя к объекту пользователя
        user.userData = userData;

        // Возвращаем обновленный объект пользователя
        return user;
      })
    );
    const count = await UserModel.find().count();
    // Возвращаем массив пользователей с данными пользователя
    return { result, count };
    //}
  } catch (err) {
    console.log(err);
  }
});
