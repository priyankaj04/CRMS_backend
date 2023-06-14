const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const Hashpassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const Comparepassword = async (password, hashpassword) => {
    try {
        const comparing = await bcrypt.compare(password, hashpassword);
        console.log(comparing);
        return comparing;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
        user: 'priyankaj2002o4@gmail.com',
        pass: 'bedpfjiwqrefmles',
    },
});

// Define a function to send the email
const sendOTP = (email, otp) => {
    const mailOptions = {
        from: 'priyankaj2002o4@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your One-Time Password (OTP) is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.log(info);
        if (error) {
            console.error('Error sending OTP emailkjhkkjh', error);
            return { status : 0, message: error}
        } else {
            console.log('OTP email sent successfully');
            return { status : 1, message: info} 
        }
    });
};

const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

module.exports = { Hashpassword, Comparepassword, sendOTP, generateRandomNumber }