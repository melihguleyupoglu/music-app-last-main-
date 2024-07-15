"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var objection_1 = require("objection");
var knex_1 = require("knex");
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
// const crypto = require('crypto')
// const nodeMailer = require('nodemailer')
var bcrypt = require('bcrypt');
var ACCESS_SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDE3Mjk0MywiaWF0IjoxNzIwMTcyOTQzfQ.YitGYvsMWMBRc22SWfC3HvNLN9WRaNM9QslDBZAXWc8';
var REFRESH_SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDUxNjA3NywiaWF0IjoxNzIwNTE2MDc3fQ.uswAHArLKhMHkZ3f-N-hH4Ia5d6vFwOxe8eP3pA8HYs';
var generateAccessToken = function (username) {
    return jwt.sign({ username: username }, ACCESS_SECRET_KEY, { expiresIn: '15m' });
};
var generateRefreshToken = function (username) {
    return jwt.sign({ username: username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds, salt, hash, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 12;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcrypt.genSalt(saltRounds)];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 3:
                hash = _a.sent();
                return [2 /*return*/, hash];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
var knex = (0, knex_1.default)({
    client: 'pg',
    useNullAsDefault: true,
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'melihguleyupoglu',
        password: '1234',
        database: 'music_app'
    }
});
objection_1.Model.knex(knex);
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(User, "tableName", {
        get: function () {
            return 'users';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User, "relationMappings", {
        get: function () {
            return {
                children: {
                    relation: objection_1.Model.HasManyRelation,
                    modelClass: User,
                    join: {
                        from: 'users.id',
                        to: 'users.parentId'
                    }
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return User;
}(objection_1.Model));
var app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(cors());
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, storedHashPassword, match, accessToken, refreshToken, error_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, knex.select('hashed').from('users').where('username', username)];
            case 2:
                storedHashPassword = _b.sent();
                if (storedHashPassword.length === 0) {
                    res.status(404).send({ message: 'Kullanıcı bulunamadı' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt.compare(password, storedHashPassword[0].hashed)];
            case 3:
                match = _b.sent();
                if (!match) return [3 /*break*/, 8];
                accessToken = generateAccessToken(username);
                refreshToken = generateRefreshToken(username);
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, knex('users').where('username', username).update({ refresh_token: refreshToken })];
            case 5:
                _b.sent();
                res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
                console.log(refreshToken, accessToken);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                res.status(500).send({ message: 'Veritabanı hatası: ' + error_1 });
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(401).send({ message: 'Şifreler eşleşmiyor' });
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_2 = _b.sent();
                res.status(500).send({ message: 'Sunucu hatası: ' + error_2 });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
app.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, insertUser;
    return __generator(this, function (_b) {
        _a = req.body, username = _a.username, email = _a.email, password = _a.password;
        knex
            .select('email')
            .from('users')
            .where('email', email)
            .then(function (emailList) {
            if (emailList.length === 0) {
                knex
                    .select('username')
                    .from('users')
                    .where('username', username)
                    .then(function (usernameList) {
                    if (usernameList.length === 0) {
                        insertUser(email, username, password);
                    }
                    else {
                        res.status(204).send({ message: '204' });
                    }
                });
            }
            else {
                res.status(202).send({ message: '202' });
            }
        });
        insertUser = function (email, username, password) { return __awaiter(void 0, void 0, void 0, function () {
            var hashedPassword, newUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, hashPassword(password)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, User.query().insert({
                                username: username,
                                email: email,
                                hashed: hashedPassword,
                                salt: '20'
                            })];
                    case 2:
                        newUser = _a.sent();
                        res.status(200).send({
                            message: 'User created succesfully.',
                            user: newUser
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        res.status(500).send({ message: error_3 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return [2 /*return*/];
    });
}); });
app.post('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, user_1, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = req.body.refresh_token;
                // console.log(refreshToken);
                if (!refreshToken) {
                    return [2 /*return*/, res.status(401).send({ message: 'Refresh token is required' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, knex('users').where('refresh_token', refreshToken).first()];
            case 2:
                user_1 = _a.sent();
                if (!user_1) {
                    return [2 /*return*/, res.status(403).send({ message: 'Invalid refresh token' })];
                }
                jwt.verify(refreshToken, REFRESH_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        return res.status(403).send({ message: 'Invalid refresh token2' });
                    }
                    var newAccessToken = generateAccessToken(user_1.username);
                    res.status(200).json({ accessToken: newAccessToken });
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).send({ message: 'Server error' + error_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () { return console.log('Server is running on port 3000'); });
function createSchema() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.schema.hasTable('users')];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, knex.schema.createTable('users', function (table) {
                            table.increments('id').primary();
                            table.string('username');
                            table.string('email');
                            table.string('hashed');
                            table.string('salt');
                            table.string('refresh_token');
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Running');
            return [2 /*return*/];
        });
    });
}
createSchema()
    .then(function () { return main(); })
    .then(function () { return knex.destroy; })
    .catch(function (err) {
    console.error(err);
    return knex.destroy();
});
