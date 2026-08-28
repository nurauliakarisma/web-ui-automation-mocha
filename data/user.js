const users = {
    validUser: {
        username: "admin",
        password: "admin"
    },
    invalidPasswordUser: {
        username: "admin",
        password: "invalid_password_123"
    },
    unregisteredUser: {
        username: "unregistered_user_999",
        password: "random_password"
    },
    login: {
        username: "admin",
        password: "admin"
    }
};

module.exports = users;