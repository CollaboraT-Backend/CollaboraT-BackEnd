import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host: 'localhost', // Se conecta al servidor SMTP local
    //   port: 1025,
    //   secure: false, // No SSL, ya que es un servidor local
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Usar SSL
        auth: {
          user: 'collaborat.workspace@gmail.com', // mira man aquí va tu correo de gmail
          pass: 'hvbq qsoq qadb mngo', // aquí va la contraseña que te dio esa vaina pero sin espacios, yo te recomiendo que esta verega la metas en los .env
        },
      });
  }


  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: 'collaborat.workspace@gmail.com',
      to,
      subject,
      html,
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  prepareMail(mailOptions) {
    return {
        from: '"CollaboraT Team" <collaborat.workspace@gmail.com>',
        to: mailOptions.to,
        subject: 'Te han agregado una tarea nueva',
        html: `
    <html>
      <head>
        <style>
          .header { background-color: #fcfffe; padding: 10px; }
          .content { font-family: Arial, sans-serif; background-color: #fffff;  }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color: #00A64E">CollaboraT</h1>

        </div>
        <div class="content">
          <p>Hola ${mailOptions.name}! Te asignaron tareas en un proyecto.</p>
        </div>
      </body>
    </html>
  `}
  }
  
}
