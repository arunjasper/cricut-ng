import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const startDateBeforeEndDateValidator = (): ValidatorFn => {
    return (ctl: AbstractControl): ValidationErrors | null => {
        const startDate = ctl.get('startDate')?.value;
        const endDate = ctl.get('endDate')?.value;
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            if (start > end) {
                return { startBeforeEnd: true };
            }
        }
        return null;
    }
};

