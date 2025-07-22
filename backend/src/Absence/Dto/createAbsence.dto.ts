// create-absence.dto.ts
import { IsDateString, IsNotEmpty, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'dateRange', async: false })
class DateRangeValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const obj = args.object as any;
        if (!obj.startDate || !obj.endDate) return false;
        return new Date(obj.startDate) <= new Date(obj.endDate);
    }
    defaultMessage(args: ValidationArguments) {
        return 'startDate must be before or equal to endDate';
    }
}

export class CreateAbsenceDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    reason?: string;

    @Validate(DateRangeValidator)
    dateRangeCheck: boolean;
}
