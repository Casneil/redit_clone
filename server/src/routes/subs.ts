import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../helpers/helpers";
import path from "path";

import Sub from "../entities/Sub";
import User from "../entities/User";

import auth from "../middleware/auth";
import user from "../middleware/user";
import Post from "../entities/Post";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name must not be empty";
    if (isEmpty(title)) errors.name = "Title must not be empty";

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub already exists";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, description, title, user });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;

    if (res.locals.user) {
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    }

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ sub: "Sub not found" });
  }
};

const ownsSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({
      where: { name: req.params.name },
    });

    if (sub.username !== user.username) {
      return res.status(403).json({ error: "You don't own this sub" });
    }
    res.locals.sub = sub;
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Image upload
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname)); // eg jh34gfts.png
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Image format not supported"));
    }
  },
});

const uploadSubImage = async (_: Request, res: Response) => {
  return res.json({ success: true });
};

const router = Router();

router.post("/", user, auth, createSub);
router.get("/:name", user, getSub);
router.post(
  "/:name/image",
  user,
  auth,
  ownsSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
