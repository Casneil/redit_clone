import { Request, Response, Router } from "express";
import { validate } from "class-validator";

import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		// TODO: Validata data
		// TODO: Create user
		const user = new User({ email, username, password });
		const errors = await validate(user);
		if (errors.length > 0) return res.status(400).json({ errors });
		await user.save();
		// TODO: Return the user
		return res.json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

const router = Router();
router.post("/register", register);

export default router;
