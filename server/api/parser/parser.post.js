import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url } = body;

  if (!url) {
    throw createError({
      statusCode: 400,
      message: "URL обязателен",
    });
  }

  try {
    const html = await $fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    const lessons = [];
    $("li.lessons-item").each((index, element) => {
      const title = $(element).find(".lessons-title").text().trim();
      const duration = $(element).find(".lessons-duration").text().trim();
      const name = $(element).find(".lessons-name").text().trim();

      lessons.push({
        lessonNumber: title,
        duration,
        name,
      });
    });

    return {
      status: "success",
      lessons,
    };
  } catch (error) {
    console.error("Ошибка парсинга:", error.message);
    throw createError({
      statusCode: 500,
      message: "Не удалось загрузить или обработать HTML",
    });
  }
});
