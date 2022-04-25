"use strict";
/**
 * @file Declares MaritalStatus data type representing the marital status of a user
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @enum {string} Enum representing marital status of a user
 */
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["Married"] = "MARRIED";
    MaritalStatus["Single"] = "SINGLE";
    MaritalStatus["Widowed"] = "WIDOWED";
})(MaritalStatus || (MaritalStatus = {}));
;
exports.default = MaritalStatus;
