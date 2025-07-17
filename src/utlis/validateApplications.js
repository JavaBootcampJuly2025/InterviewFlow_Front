import { ApplicationStatus } from '../types/applicationStatus.js';
import { ValidationError } from './ValidationError.js';
import isURL from 'validator/lib/isURL';

export function validateUrl(url) {
    if (typeof url !== 'string' || !url.trim()) {
        return 'URL must be a non-empty string';
    }

    const normalized = url.trim();

    if (!isURL(normalized, { require_protocol: true })) {
        return 'Invalid URL. Must start with http:// or https://';
    }

    return null;
}

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

    if (!application.companyName || typeof application.companyName !== 'string' || !application.companyName.trim()) {
        errors.companyName = 'Missing or invalid company name';
    }

    if (!application.position || typeof application.position !== 'string' || !application.position.trim()) {
        errors.position = 'Missing or invalid position';
    }

    if (application.companyLink) {
        const urlError = validateUrl(application.companyLink);
        if (urlError) {
            errors.companyLink = urlError;
        }
    }

    if (application.createdAt && isNaN(Date.parse(application.createdAt))) {
        errors.createdAt = 'Invalid createdAt date';
    }

    if (application.updatedAt && isNaN(Date.parse(application.updatedAt))) {
        errors.updatedAt = 'Invalid updatedAt date';
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
