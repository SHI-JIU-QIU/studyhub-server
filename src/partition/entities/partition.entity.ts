import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Partition {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({
        nullable:false
    })
    partitionName:string

    @Column({
        nullable:false
    })
    avatarUrl:string



    @ManyToMany(()=>User,user =>user.partitions)
    users:User[]

}
