import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(
    to: string,
    template: string,
    subject: string,
    context: Record<string, any>,
  ) {
    await this.mailerService.sendMail({
      to, // người nhận
      subject, // Tiêu đề email
      template, // Name of the template file without extension
      context, // Biến để sử dụng trong template,
    });
    return { message: 'Welcome email sent successfully' };
  }
}
