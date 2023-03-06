import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, BeforeUpdate, OneToMany, Tree, TreeChildren } from "typeorm";



@Entity()

export class Fans {
    @PrimaryGeneratedColumn()
    id: string


    @Column()
    fansId:string

    @Column()
    followId:string




}
