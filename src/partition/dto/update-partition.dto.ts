import { PartialType } from '@nestjs/mapped-types';
import { CreatePartitionDto } from './create-partition.dto';

export class UpdatePartitionDto extends PartialType(CreatePartitionDto) {}
