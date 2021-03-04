import { Request, Response, Router } from "express";
import { getConnection } from "typeorm";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import User from "../entities/User";
import Vote from "../entities/Vote";

import auth from "../middleware/auth";
import user from "../middleware/user";

const router = Router();

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  // Validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: "Value must be -1, 0, or 1" });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // If Comment Identifier find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // Find vote by post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      // If no vote and value = 0 return error.
      return res.status(404).json({ error: "Vote not found" });
    } else if (!vote) {
      // If there is not yet a vote we create a new vote
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      // If vote exists and value === 0, then we remove vote from DB.
      await vote.remove();
    } else if (vote.value !== value) {
      // If vote found and value has chanbged update the vote with new value.
      vote.value = value;
      await vote.save();
    }
    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title,s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy(`s.title,s.name, "imageUrl"`)
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

router.post("/vote", user, auth, vote);
router.get("/top-subs", topSubs);

export default router;
