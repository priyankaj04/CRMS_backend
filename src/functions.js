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

const generateOTP = () => {
    const otpLength = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString().substr(0, otpLength);
    return otp;
};

// const sendOTPSMS = (phoneNumber) => {
//     const otp = generateOTP();
//     const message = `Your OTP is: ${otp}`;

//     twilio.messages
//         .create({
//             body: message,
//             from: twilioPhoneNumber,
//             to: phoneNumber,
//         })
//         .then((message) => console.log('OTP sent:', message.sid))
//         .catch((error) => console.error('Error sending OTP:', error));
// };

// // Example usage
// const phoneNumber = '+1234567890'; // Replace with the recipient's phone number
// sendOTPSMS(phoneNumber);



module.exports = { Hashpassword, Comparepassword, sendOTP, generateRandomNumber }