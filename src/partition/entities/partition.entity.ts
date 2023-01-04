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

    @Column({
        nullable:false,
        default:0
    })
    vote:number

    @Column({
        nullable:false,
        default:0
    })
    status:number


    @ManyToMany(()=>User,user =>user.partitions)
  
    users:User[]

}
