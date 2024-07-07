import { body } from "express-validator";

const userValidation = [
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export default userValidation;
