import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, BeforeUpdate, OneToMany, Tree, TreeChildren } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Exclude } from "class-transformer";
import { Partition } from "src/partition/entities/partition.entity";



@Entity()

export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        nullable: false
    })
    username: string

    @Column({
        nullable: false,
        default: 'sh' + new Date().getTime()
    })
    nickname: string

    @Column({
        nullable: false
    })
    @Exclude()
    password: string

    @Column({
        nullable: true
    })
    biography: string

    @Column({
        nullable: true
    })
    avatar: string

    @Column({
        nullable: true
    })
    gender: number

    @Column({
        nullable: true
    })
    birthday: Date

    @Column({
        nullable: true
    })
    telephone: string

    @Column({
        nullable: false
    })
    email: string

    @Column({
        nullable: true
    })
    city: string

    @Column({
        nullable: true,
        default: 0
    })
    points: number

    @Column({
        nullable: false,
    })
    role:number



    @ManyToMany(() => Partition, partition => partition.users, {
        cascade: true
    })
    @JoinTable({
        name: 'user_partition',
        joinColumns: [{ name: 'user_id' }],
        inverseJoinColumns: [{ name: 'partition_id' }],
    })
    partitions: Partition[];

    @BeforeInsert()
    @BeforeUpdate()
    async encryptPwd() {
        if (!this.password) return;
        this.password = await bcrypt.hashSync(this.password, 10);
    }

}
