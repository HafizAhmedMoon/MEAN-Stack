module.exports = {

    port: process.env.PORT || 8080,

    ip: process.env.IP || "127.0.0.1",

    appName:"App Name",

    db: process.env.MONGODB || 'mongodb://localhost:27017/test',

    email: {
        name:'App Name', // Email sender name
        service: process.env.MAIL_SERVICE || 'SendGrid', // Email Service
        user: process.env.MAIL_USER || 'hslogin', // Email Username or emailAddress
        pass: process.env.MAIL_PASS || 'hspassword00' // Email Password
    },

    secret: "secret" // your secret
};
