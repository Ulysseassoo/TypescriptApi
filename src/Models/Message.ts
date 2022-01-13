import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column("text")
	content: string

	@Column({ type: "datetime" })
	createdAt: Date

	@ManyToOne(() => User, (user) => user.messages)
	user: User
}
