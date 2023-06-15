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
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: 'priyankaj2002o4@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your One-Time Password (OTP) is: ${otp}`,
    };
    let res;
    try {
        res = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email', error);
                return false;
            } else {
                console.log('OTP email sent successfully');
                return true;
            }
        });
    } catch (err) {
        return false;
    }
    //console.log("IS email?", resp)
    return res;
};

const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

module.exports = { Hashpassword, Comparepassword, sendOTP, generateRandomNumber }