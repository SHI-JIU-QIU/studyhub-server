import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, BeforeUpdate, OneToMany, Tree, TreeChildren } from "typeorm";



@Entity()

export class Chat {
    @PrimaryGeneratedColumn()
    id: string

    @Column({
        nullable: true
    })
    text: string

    @Column({
        nullable: true
    })
    image: string

    @Column()
    fromId: string

    @Column()
    toId: string

    @Column({
        default: new Date().toLocaleString()
    })
    createTime: Date

    @Column()
    isReceived: number

}
