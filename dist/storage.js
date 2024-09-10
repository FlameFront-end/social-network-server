"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avaStorage = void 0;
const multer_1 = require("multer");
const generateId = () => Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
const normalizeFileName = (req, file, callback) => {
    const fileExtName = file.originalname.split('.').pop();
    callback(null, `${generateId()}.${fileExtName}`);
};
exports.avaStorage = (0, multer_1.diskStorage)({
    destination: './uploads/ava',
    filename: normalizeFileName
});
//# sourceMappingURL=storage.js.map