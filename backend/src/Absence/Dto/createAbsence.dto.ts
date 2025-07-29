import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dateRange', async: false })
class DateRangeValidator implements ValidatorConstraintInterface {
    validate(_value: any, args: ValidationArguments) {
        const obj = args.object as any;
        return new Date(obj.startDate) <= new Date(obj.endDate);
    }

    defaultMessage() {
        return 'startDate must be before or equal to endDate';
    }
}

export class CreateAbsenceDto {
    @IsDateString()
    @Validate(DateRangeValidator)
    startDate: string;
    @IsDateString()
    endDate: string;
    @IsOptional()
    @IsString()
    reason?: string;
}
