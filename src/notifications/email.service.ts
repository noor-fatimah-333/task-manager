import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noor.fatima@codedistrict.com',
        pass: 'dyoi cbiu afvh dbwy',
      },
    });
  }

  async sendTaskReminder(email: string, taskTitle: string, dueDate: Date) {
    const mailOptions = {
      from: 'noor.fatima@codedistrict.com',
      to: email,
      subject: 'Task Reminder',
      text: `Reminder: Your task "${taskTitle}" is due on ${dueDate.toDateString()}.`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
