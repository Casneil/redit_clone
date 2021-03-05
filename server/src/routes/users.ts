import { Request, Response, Router } from "express";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";

import user from "../middleware/user";

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });
    const posts = await Post.find({
      where: { user },
      relations: ["comments", "votes", "sub"],
    });
    const comments = await Comment.find({
      where: { user },
      relations: ["post"],
    });

    if (res.locals.user) {
      posts.forEach((post) => post.setUserVote(res.locals.user));
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }

    //Make an array to combine posts with comments
    let submissions: Array<any> = [];
    posts.forEach((post) =>
      submissions.push({ type: "Post", ...post.toJSON() })
    );
    comments.forEach((comment) =>
      submissions.push({ type: "Comment", ...comment.toJSON() })
    );

    //Sort data
    submissions.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, submissions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.get("/:username", user, getUserSubmissions);

export default router;
