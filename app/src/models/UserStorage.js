"use strict";

class UserStorage {
    static #users = { // #: public >> private 변환(외부에서 불러올 수 없음)
        id: ["asdf", "qwer", "zxcv"],
        psword: ["1234", "1234", "12345"],
        name: ["서범석", "민웅기", "홍길동"],
    };

    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers, field) =>{
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }
}

module.exports = UserStorage;