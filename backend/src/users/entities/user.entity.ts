import { Post } from "../../posts/entities/post.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    name: string;

    @Column({nullable: true})
    password?: string;

    @Column({nullable: true})
    providerId?: string;

    @Column({nullable: true})
    provider?: 'google' | 'facebook';

    @OneToMany(() => Post, (post) => post.author, { cascade: true, onDelete: 'CASCADE' })
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        if(this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

}
