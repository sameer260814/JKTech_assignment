import { Post } from "../../posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    name: string;

    @Column({nullable: true})
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];
}
