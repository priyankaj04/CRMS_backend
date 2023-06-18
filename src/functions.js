const bcrypt = require('bcrypt');
const accountSid = "AC898cc801200d08b25192d5143e18a19e";
const authToken = "e0f32cb7b1f97d2d639e9a1a21501040";
const twilio = require("twilio")(accountSid, authToken);

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



const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

// const generateOTP = () => {
//     const otpLength = 6;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString().substr(0, otpLength);
//     return otp;
// };

const sendOTPSMS = (phoneNumber) => {
    const otp = generateRandomNumber();
    const message = `Your OTP is: ${otp}`;

    twilio.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber,
        })
        .then((message) => console.log('OTP sent:', message.sid))
        .catch((error) => console.error('Error sending OTP:', error));
};

// // Example usage
// const phoneNumber = '+1234567890'; // Replace with the recipient's phone number
// sendOTPSMS(phoneNumber);



module.exports = { Hashpassword, Comparepassword, generateRandomNumber, sendOTPSMS }