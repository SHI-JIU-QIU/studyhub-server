import { IsNotEmpty, Length } from "class-validator"

export class CreatePartitionDto {

    @IsNotEmpty()
    @Length(1, 10)
    partitionName: string
}
