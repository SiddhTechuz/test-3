const nodemailer = require('nodemailer');
module.exports = class Email {
    constructor(user) {
        this.name = user.name
        this.to = user.email;
        this.from = 'test3<admin@test3.io>'
    }

    newTransport() {
        console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
        if (process.env.NODE_ENV === 'production') {
            return 1
        }
        else {
            return nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: process.env.EMAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            })
        }
    }
    async send(subject, text) {
        //1 render  html based on templates

        //2 Defineemail options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text
        }
        await this.newTransport().sendMail(mailOptions)
        console.log('mail sent');
    }
    async sendWelcome() {
        await this.send('Registeration Succesfull', `Welcome!!! ${this.name} your account has beem succesfully created `)
    }
}
