import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import './Dashboard.css';
import { mockJobApplications } from '../mockData.js';
import { validateApplications } from "../utlis/validateApplications.js";
import 'react-datepicker/dist/react-datepicker.css';
import ApplicationEditForm from "../components/ApplicationEditForm.jsx";
import Button from "../components/Button.jsx";
import Layout from '../components/Layout.jsx';



export default function DashboardPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [addingJob, setAddingJob] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setErrors([]);
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const data = mockJobApplications;
                const validJobs = validateApplications(data);
                setJobs(validJobs);
            } catch (err) {
                setErrors(prev => {
                    const newMsg = err.message || 'Unknown error';
                    if (prev.includes(newMsg)) return prev;
                    return [...prev, newMsg];
                });
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function updateJobInList(updatedJob) {
        setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    }

    function addNewJob(newJob) {
        setJobs(prevJobs => [newJob, ...prevJobs]);
    }

    function formatForDateTimeLocal(isoString) {
        if (!isoString) return '';
        return isoString.substring(0, 16);
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <p>Loading job applications...</p>
            </div>
        );
    }

    if (errors.length > 0) {
        return (
            <div className="dashboard-container">
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {errors.map((errMsg, idx) => (
                        errMsg.split('\n').map((line, i) => (
                            <p key={`${idx}-${i}`} style={{ marginBottom: '0.5rem' }}>
                                Error: {line}
                            </p>
                        ))
                    ))}
                </div>
            </div>
        );
    }

    if (jobs.length === 0 && !addingJob) {
        return (
            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <Button variant="primary" onClick={() => setAddingJob(true)}>Add Job</Button>
                <p>No job applications found.</p>
            </div>
        );
    }
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <Button variant="primary" onClick={() => setAddingJob(true)}>Add Job</Button>

            {addingJob && (
                <div style={{marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '6px'}}>
                    <h3>New Job Application</h3>
                    <ApplicationEditForm
                        job={null}
                        onClose={() => setAddingJob(false)}
                        onUpdateJob={(newJob) => {
                            addNewJob(newJob);
                            setAddingJob(false);
                        }}
                        formatForDateTimeLocal={formatForDateTimeLocal}
                        isNew
                    />
                </div>
            )}

            <table className="jobs-table">
                <thead>
                <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {jobs.map(job => (
                    <React.Fragment key={job.id}>
                        <tr>
                            <td>
                                {job.company_link ? (
                                    <a href={job.company_link} target="_blank" rel="noopener noreferrer">
                                        {job.company_name}
                                    </a>
                                ) : (
                                    job.company_name
                                )}
                            </td>
                            <td>{job.position}</td>
                            <td><StatusBadge status={job.status}/></td>
                            <td>
                                {job.created_at
                                    ? new Date(job.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : ''}
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => setExpandedJobId(job.id === expandedJobId ? null : job.id)}
                                >
                                    {job.id === expandedJobId ? 'Close' : 'Edit'}
                                </Button>
                            </td>
                        </tr>
                        {job.id === expandedJobId && (
                            <tr>
                                <td colSpan={5}>
                                    <ApplicationEditForm
                                        job={job}
                                        onClose={() => setExpandedJobId(null)}
                                        onUpdateJob={updateJobInList}
                                        formatForDateTimeLocal={formatForDateTimeLocal}
                                    />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
}

