import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 5,
    description: 'Number of items requested',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) //transformar QUERY a tipo NUMBER
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Number of items skipped',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
