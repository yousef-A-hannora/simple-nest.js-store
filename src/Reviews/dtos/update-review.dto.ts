import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDTO } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDTO) {}
