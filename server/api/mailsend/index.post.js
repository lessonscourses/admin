import nodemailer from "nodemailer";
const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.MAILHOST,
  port: config.MAILPORT,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASSWORD,
  },
});

export default defineEventHandler(async (event, response) => {
  try {
    const body = await readBody(event);
    const mail = {
      form: `"${body.username}" <${body.email}>`,
      to: config.CONTACTMAIL,
      subject: body.username,
      html: `${body.username} / ${body.phone} / ${body.description}`,
    };
    // const mailClient = {
    //   form: `"${body.name}" <${config.CONTACTMAIL}>`,
    //   to: body.email,
    //   subject: body.name,
    //   text: body.info,
    //   html: body.description,
    // };
    await transporter.sendMail(mail);
    // await transporter.sendMail(mailClient);
  } catch (event) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: error,
      })
    );
  }
});
