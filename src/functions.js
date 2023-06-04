const bcrypt = require('bcrypt');

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

module.exports = { Hashpassword, Comparepassword }