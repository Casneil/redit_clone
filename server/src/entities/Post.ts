import { Column, Entity as TOEntity, Index } from "typeorm";
const bcrypt = require("bcrypt");

import Entity from "./Entity";
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
	slud: string;

  @Column({nullable: true, type: "text"})
  body: string;


}
