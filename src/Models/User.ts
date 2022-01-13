import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Message } from "./Message"

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	firstname: string

	@Column()
	lastname: string

	@Column()
	email: string

	@Column()
	password: string

	@OneToMany(() => Message, (message) => message.user)
	messages: Message[]
}
