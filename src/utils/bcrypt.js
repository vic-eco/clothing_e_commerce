const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

const comparePasswords = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}

module.exports = {hashPassword, comparePasswords};