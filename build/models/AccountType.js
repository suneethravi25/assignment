"use strict";
/**
 * @file Declares AccountType data type representing the account type of a user
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @readonly
 * @enum {string} Enum representing account type of a user
 */
var AccountType;
(function (AccountType) {
    AccountType["Personal"] = "PERSONAL";
    AccountType["Academic"] = "ACADEMIC";
    AccountType["Professional"] = "PROFESSIONAL";
})(AccountType || (AccountType = {}));
;
exports.default = AccountType;
