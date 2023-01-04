import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import bcrypt from 'bcryptjs'
import { Exclude } from "class-transformer";
import { Partition } from "src/partition/entities/partition.entity";
import { partition } from "rxjs";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        nullable: false
    })
    username: string

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

    @BeforeInsert()
    async encryptPwd() {
        if (!this.password) return;
        this.password = await bcrypt.hashSync(this.password, 10);
    }

    @ManyToMany(() => Partition,partition => partition.users)
    @JoinTable({
        name: 'user_partition',
        joinColumns: [{ name: 'user_id' }],
        inverseJoinColumns: [{ name: 'partition_id' }],
      })
    partitions: Partition[];



}
