import { body } from "express-validator"
export const messageValidator = [body("content").isLength({ min: 1 }), body("createdAt").isDate()]
