import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	JoinColumn,
	ManyToOne,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../helpers/helpers";
import { Sub } from "./Sub";
import Comment from "./Comment";
@TOEntity("posts")
export class Post extends Entity {
	constructor(post: Partial<Post>) {
		super();
		Object.assign(this, post);
	}

	@Index()
	@Column()
	identifier: string; // 7 character id

	@Column()
	title: string;

	@Index()
	@Column()
	slug: string;

	@Column({ nullable: true, type: "text" })
	body: string;

	@Column()
	subName: string;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	user: User;

	@ManyToOne(() => Sub, (sub) => sub.posts)
	@JoinColumn({ name: "subName", referencedColumnName: "name" })
	sub: Sub;

	@ManyToOne(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(7);
		this.slug = slugify(this.title);
	}
}
