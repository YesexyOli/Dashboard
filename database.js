var mysql = require('mysql');

module.exports = class Database {

    constructor(host, user, password, database) {
        this.con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        this.connect();
    }

    connect() {
        this.con.connect((err) => {
            if (err) throw err;
            console.log('connected !')
        });
    }

    addWidget(account_id, widget_id, cb) {
        this.con.query("INSERT INTO `dashboard`.`widgets` (`user_id`, `widget_id`) VALUES ('" + account_id + "', '" + widget_id + "')", function (err, result, fields) {
            if (err) throw err;
            cb(true);
        });

    }

    changeWidgetOrder(widget_it, order) {
        this.con.query("UPDATE `dashboard`.`widgets` t SET t.`order` = '" + order + "' WHERE t.`id` = '" + widget_it + "'", function (err, result, fields) {
            if (err) throw err;
        });
    }

    deleteWidget(account_id, widget_id, cb) {
        this.con.query("DELETE FROM `dashboard`.`widgets` WHERE `user_id` = '" + account_id + "' AND `widget_id` = '" + widget_id + "' LIMIT 1", function (err) {
            if (err) throw err;
            cb(true);
        });
    }

    getAccountWidgets(id, cb) {
        this.con.query("SELECT * FROM widgets WHERE user_id = '" + id + "'  ORDER BY `order` ASC", (err, result, fields) => {
            if (err) throw err;
            cb(result);
        });
    }

    getAccounts() {
        this.con.query("SELECT * FROM accounts", function (err, result, fields) {
            if (err) throw err;
            return result;
        });
    }

    getAccountById(id, cb) {
        this.con.query("SELECT * FROM accounts WHERE id = '" + id + "'", function (err, result, fields) {
            if (err) throw err;
            cb(result);
        });
    }

    getAccountByUsername(username, cb) {
        this.con.query("SELECT * FROM accounts WHERE username = '" + username + "'", function (err, result, fields) {
            if (err) throw err;
            cb(result);
        });
    }

    getAccount(username, password, cb) {
        this.con.query("SELECT * FROM accounts WHERE username = '" + username + "' AND password = '" + password + "'", function (err, result, fields) {
            if (err) throw err;
            cb(err, result);
        });
    }

    login(username, password, cb) {
        this.getAccount(username, password, (err, data) => {
            cb(err, data);
        });
    }


    createAccount(username, password, cb) {
        if (this.getAccountByUsername(username, (data) => {
            if (data.length == 0) {
                this.con.query("INSERT INTO `dashboard`.`accounts` (`username`, `password`) VALUES ('" + username + "', '" + password + "')", function (err, result, fields) {
                    if (err) throw err;
                    cb(true);
                });
            } else {
                cb(false);
            }
        })) ;
    }

};