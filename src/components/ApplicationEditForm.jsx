import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApplicationStatus } from '../types/applicationStatus.js';
import { statusColors } from './StatusBadge.jsx';
import { toLocalDateTimeString } from '../utlis/date.js';
import Button from './Button.jsx';
import { validateApplication } from '../utlis/validateApplications.js';

export default function ApplicationEditForm({ job, onClose, onUpdateJob, formatForDateTimeLocal, isNew = false }) {
    const [formData, setFormData] = useState(() => ({
        id: job?.id || null,
        company_name: job?.company_name || '',
        company_link: job?.company_link || '',
        position: job?.position || '',
        status: job?.status || 'APPLIED',
        created_at: job?.created_at || new Date().toISOString().substring(0, 16),
        updated_at: job?.updated_at || new Date().toISOString().substring(0, 16),
    }));

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleFieldChange = ({ target: { name, value } }) => {
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setErrors(validateApplication(updatedForm));
    };

    const handleSubmit = async () => {
        const validationErrors = validateApplication(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsSaving(true);
            const id = isNew ? Date.now() : formData.id;
            const updatedJob = { ...formData, id, updated_at: toLocalDateTimeString(new Date()) };

            await new Promise(res => setTimeout(res, 500)); // simulate API delay
            onUpdateJob(updatedJob);
            alert(isNew ? 'Job added successfully! (mock)' : 'Job updated successfully! (mock)');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error saving job data');
        } finally {
            setIsSaving(false);
        }
    };

    const renderInput = (label, name, type = 'text', readOnly = false, maxLength = null) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                className="custom-input"
                value={formData[name]}
                onChange={handleFieldChange}
                readOnly={readOnly}
                maxLength={maxLength}
            />
            {errors[name] && <p className="error">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="job-edit-form">
            <div>
                <label htmlFor="status-select">Status</label>
                <select
                    id="status-select"
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    style={{ backgroundColor: statusColors[formData.status] || 'white', color: 'black' }}
                >
                    {Object.values(ApplicationStatus).map((status) => (
                        <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
                {errors.status && <p className="error">{errors.status}</p>}
            </div>

            {renderInput('Company Name', 'company_name')}
            {renderInput('Company Link', 'company_link', 'url', false, 255)}
            {renderInput('Position', 'position', 'text', false, 255)}
            {renderInput('Created At', 'created_at', 'datetime-local', true)}
            {renderInput('Updated At', 'updated_at', 'datetime-local', true)}

            <div>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={Object.keys(errors).length > 0 || isSaving}
                >
                    {isSaving ? 'Saving...' : isNew ? 'Add Job' : 'Save'}
                </Button>
                <Button variant="primary" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}

ApplicationEditForm.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        company_name: PropTypes.string,
        company_link: PropTypes.string,
        position: PropTypes.string,
        status: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    onUpdateJob: PropTypes.func.isRequired,
    formatForDateTimeLocal: PropTypes.func.isRequired,
    isNew: PropTypes.bool,
};
