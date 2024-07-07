import { body } from "express-validator";

const postsValidation = [
  body("title").isLength({ min: 3 }),
  body("description"),
  body("authorId"),
  body("tags").isArray(),
  body("comments").isArray(),
];

export default postsValidation;
