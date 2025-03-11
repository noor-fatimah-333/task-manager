import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendTaskReminder(email: string, taskTitle: string, dueDate: Date) {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Task Reminder',
      text: `Reminder: Your task "${taskTitle}" is due on ${dueDate.toDateString()}.`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
