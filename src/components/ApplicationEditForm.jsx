import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApplicationStatus } from '../types/applicationStatus.js';
import { statusColors } from './StatusBadge.jsx';
import { formatDateTimeLocal } from '../utlis/date.js';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { validateApplication } from '../utlis/validateApplications.js';

export default function ApplicationEditForm({ job, onClose, onUpdateJob, isNew = false }) {
    const [formData, setFormData] = useState(() => ({
        id: job?.id || null,
        companyName: job?.companyName || '',
        companyLink: job?.companyLink || '',
        position: job?.position || '',
        status: job?.status || 'APPLIED',
        createdAt: formatDateTimeLocal(job?.createdAt || new Date()),
        updatedAt: formatDateTimeLocal(job?.updatedAt || new Date()),
    }));

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleFieldChange = ({ target: { name, value } }) => {
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setErrors(validateApplication(updatedForm));
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job application?');
        if (!confirmDelete) return;

        try {
            setIsSaving(true);

            const response = await fetch(`http://localhost:8080/api/applications/${formData.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.status}`);
            }

            alert('Job deleted successfully!');
            onUpdateJob({ ...formData, deleted: true });
            onClose();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete job. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        const validationErrors = validateApplication(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsSaving(true);

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const payload = {
                companyName: formData.companyName,
                companyLink: formData.companyLink,
                position: formData.position,
                status: formData.status,
            };

            let response;

            if (formData.id) {
                response = await fetch(`http://localhost:8080/api/applications/${formData.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });
            } else {
                payload.userId = user.id;
                response = await fetch('http://localhost:8080/api/applications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server responded with ${response.status}`);
            }

            const result = await response.json();
            onUpdateJob(result);
            alert(formData.id ? 'Job updated successfully!' : 'Job added successfully!');
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save job: ' + error.message);
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
            <div style={{ marginBottom: '1rem' }}>
                <Typography variant="subtitle1" component="label" htmlFor="status-select" gutterBottom>
                    Status
                </Typography>

                <select
                    id="status-select"
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    style={{
                        backgroundColor: statusColors[formData.status] || 'white',
                        color: 'black',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        width: '100%',
                        marginTop: '0.25rem',
                    }}
                >
                    {Object.values(ApplicationStatus).map((status) => (
                        <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>

                {errors.status && (
                    <Typography variant="body2" color="error" sx={{ marginTop: '0.25rem' }}>
                        {errors.status}
                    </Typography>
                )}
            </div>

            {renderInput('Company Name', 'companyName')}
            {renderInput('Company Link', 'companyLink', 'url', false, 255)}
            {renderInput('Position', 'position', 'text', false, 255)}

            {!isNew && (
                <>
                    {renderInput('Created At', 'createdAt', 'datetime-local', true)}
                    {renderInput('Updated At', 'updatedAt', 'datetime-local', true)}
                </>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={Object.keys(errors).length > 0 || isSaving}
                >
                    {isSaving ? 'Saving...' : isNew ? 'Add Job' : 'Save'}
                </Button>

                <Button variant="outlined" onClick={onClose}>
                    Close
                </Button>

                {!isNew && (
                    <Button variant="outlined" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                )}
            </div>
        </div>
    );
}

ApplicationEditForm.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        companyName: PropTypes.string,
        companyLink: PropTypes.string,
        position: PropTypes.string,
        status: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    onUpdateJob: PropTypes.func.isRequired,
    isNew: PropTypes.bool,
    userId: PropTypes.number,
};
