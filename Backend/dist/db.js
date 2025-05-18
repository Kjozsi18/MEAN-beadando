"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost:27017/gardenerApp')
    .then(() => {
    console.log('Sikeres kapcsolódás a mongoose-hoz!'); // Successful connection to Mongoose!
})
    .catch((err) => {
    console.log('Kapcsolat megszakadt hiba miatt: ' + err.message); // Connection interrupted due to error:
    process.exit(1); // It's good practice to exit the process on a critical connection error
});
// While you can export mongoose, typically for a connection file,
// you might just let the connection happen and then other files import models.
// However, to match the original JS 'module.exports = mongoose;', we'll export it.
exports.default = mongoose_1.default;
