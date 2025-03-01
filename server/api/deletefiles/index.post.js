import fs from "fs";
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const data = await readBody(event);

    // Проверяем типы файлов и устанавливаем соответствующий путь для загрузки
    let uploadPath;
    data.img.forEach((file) => {
      // Извлекаем расширение файла из URL
      const fileExtension = file.url.split(".").pop().toLowerCase();
      if (
        fileExtension === "png" ||
        fileExtension === "jpeg" ||
        fileExtension === "jpg" ||
        fileExtension === "webp"
      ) {
        // Если файл изображение, используем путь для изображений
        uploadPath = config.FILES_PATH;
      } else if (fileExtension === "mp4") {
        // Если файл видео, используем путь для видео
        uploadPath = config.FILES_PATH_VIDEO;
      } else {
        // Если тип файла не поддерживается, выбрасываем ошибку
        throw new Error("Unsupported file type");
      }

      // Удаляем файлы только из соответствующего пути
      //fs.unlinkSync(`${uploadPath}${file.name}`);
      fs.unlinkSync(`/var/www/cloud/assets/images/${file.name}`);
    });

    return 200;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong.",
    });
  }
});
