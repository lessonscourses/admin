import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const lessons = await readBody(event);

    const savedLessons = await LessonModel.insertMany(lessons);

    return {
      success: true,
      message: "Lessons successfully saved",
      data: savedLessons,
    };
  } catch (err) {
    console.error("Error saving lessons:", err);
    return {
      success: false,
      message: "Failed to save lessons",
    };
  }
});
