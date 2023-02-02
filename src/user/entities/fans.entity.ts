import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, BeforeUpdate, OneToMany, Tree, TreeChildren } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Exclude } from "class-transformer";
import { Partition } from "src/partition/entities/partition.entity";



@Entity()

export class Fans {
    @PrimaryGeneratedColumn()
    id: string


    @Column()
    fansId:string

    @Column()
    followId:string




}
