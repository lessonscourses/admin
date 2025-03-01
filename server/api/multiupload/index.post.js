import multer from "multer";
import { callNodeListener } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    let filePaths = [];
    let fileNames = [];

    const destination = (req, file, cb) => {
      let uploadPath = ""; // Инициализируем путь загрузки

      // Проверяем тип файла
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
      ) {
        // Если файл изображение, используем путь для изображений
        uploadPath = config.FILES_PATH;
      } else if (file.mimetype === "video/mp4") {
        // Если файл видео, используем путь для видео
        uploadPath = config.FILES_PATH_VIDEO;
      } else {
        // Если тип файла неизвестен, генерируем ошибку
        return cb(new Error("Invalid file type"));
      }

      // Вызываем колбэк с выбранным путем загрузки
      cb(null, uploadPath);
      //cb(null, "/var/www/cloud/assets/images/");
    };

    const storage = multer.diskStorage({
      destination: destination,
      filename: (req, file, cbd) => {
        const filePath = file.originalname;
        filePaths.push(filePath);
        fileNames.push(file.originalname);
        cbd(null, filePath);
      },
    });

    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpeg" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/webp" ||
          file.mimetype === "video/mp4"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },
    });

    await callNodeListener(
      upload.array("file", 10),
      event.node.req,
      event.node.res
    );
    const bulkOps = [];
    filePaths.forEach((fileName, index) => {
      const data = {
        insertOne: {
          document: {
            path: `/images/${fileName}`,
            fileName: fileNames[index],
          },
        },
      };
      bulkOps.push(data);
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
