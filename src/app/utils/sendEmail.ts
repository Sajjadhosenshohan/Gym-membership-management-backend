import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, html: string, subject: string) => {
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   secure: config.NODE_ENV === 'production',
  //   auth: {
  //     user: config.EMAIL_USER,
  //     pass: config.EMAIL_PASS,
  //   },
  //   tls: {
  //     minVersion: 'TLSv1.2', // this one i added
  //     rejectUnauthorized: false,
  //   },
  //   socketTimeout: 60000,
  // });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    // add there only website name
    from: `"AR Bazar Portal" <${config.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
