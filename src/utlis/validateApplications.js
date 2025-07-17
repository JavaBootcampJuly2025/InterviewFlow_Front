import { ApplicationStatus } from '../types/applicationStatus.js';
import { ValidationError } from './ValidationError.js';

export function validateApplication(application) {
    const errors = {};

    if (!application || typeof application !== 'object') {
        errors.general = 'Application must be an object';
        return errors;
    }

    if (typeof application.status !== 'string' || !application.status.trim()) {
        errors.status = 'Missing or invalid status';
    } else if (!Object.values(ApplicationStatus).includes(application.status)) {
        errors.status = `Unknown status "${application.status}"`;
    }

    if (!application.company_name || typeof application.company_name !== 'string' || !application.company_name.trim()) {
        errors.company_name = 'Missing or invalid company name';
    }

    if (!application.position || typeof application.position !== 'string' || !application.position.trim()) {
        errors.position = 'Missing or invalid position';
    }

    if (application.company_link && typeof application.company_link === 'string' && application.company_link.trim()) {
        const urlPattern = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/.*)?$/;
        if (!urlPattern.test(application.company_link)) {
            errors.company_link = 'Invalid company link URL';
        }
    }

    if (application.created_at && isNaN(Date.parse(application.created_at))) {
        errors.created_at = 'Invalid created_at date';
    }

    if (application.updated_at && isNaN(Date.parse(application.updated_at))) {
        errors.updated_at = 'Invalid updated_at date';
    }

    return errors;
}

export function validateApplications(data) {
    if (!Array.isArray(data)) {
        throw new ValidationError('Job data is not an array');
    }

    const allErrors = [];

    data.forEach((application, idx) => {
        const errors = validateApplication(application);
        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.entries(errors)
                .map(([field, message]) => `${field}: ${message}`)
                .join('; ');
            allErrors.push(`Error at index ${idx}: ${errorMessages}`);
        }
    });

    if (allErrors.length > 0) {
        throw new ValidationError(allErrors.join('\n'));
    }

    return data;
}
