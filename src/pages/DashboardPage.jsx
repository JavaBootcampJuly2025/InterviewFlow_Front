import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import './Dashboard.css';
import ApplicationEditForm from '../components/ApplicationEditForm.jsx';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Layout from '../components/Layout.jsx';
import { validateUrl } from '../utlis/validateApplications.js';
import { formatDateTimeLocal } from '../utlis/date.js';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [addingJob, setAddingJob] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) return;

        setUser(userData);

        fetch(`http://localhost:8080/api/users/${userData.id}/applications`, {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch applications: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => setJobs(data))
            .catch((err) => console.error('Error loading applications:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        navigate("/login");
        localStorage.removeItem("user");
        setUser(null);
    };

    function updateJobInList(updatedJob) {
        setJobs((prevJobs) => prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
    }

    function addNewJob(newJob) {
        setJobs((prevJobs) => [newJob, ...prevJobs]);
    }

    function removeJobFromList(deletedId) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedId));
    }

    if (loading) {
        return (
            <Layout>
                <div className="dashboard-container">
                    <p>Loading job applications...</p>
                </div>
            </Layout>
        );
    }

    if (errors.length > 0) {
        return (
            <Layout>
                <div className="dashboard-container">
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                        {errors.map((errMsg, idx) =>
                            errMsg.split('\n').map((line, i) => (
                                <p key={`${idx}-${i}`} style={{ marginBottom: '0.5rem' }}>
                                    Error: {line}
                                </p>
                            ))
                        )}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout user={user} handleLogout={handleLogout}>
            <div className="dashboard-container">
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>

                <Button variant="contained" color="primary" onClick={() => setAddingJob(true)}>
                    Add Job
                </Button>

                {addingJob && (
                    <div
                        style={{
                            marginBottom: '1rem',
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '6px',
                        }}
                    >
                        <Typography variant="h6" component="h2" gutterBottom>
                            New Job Application
                        </Typography>
                        <ApplicationEditForm
                            job={null}
                            userId={user?.id}
                            onClose={() => setAddingJob(false)}
                            onUpdateJob={(newJob) => {
                                addNewJob(newJob);
                                setAddingJob(false);
                            }}
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
                    {jobs.map((job) => (
                        <React.Fragment key={job.id}>
                            <tr>
                                <td>
                                    {validateUrl(job.companyLink) === null ? (
                                        <a href={job.companyLink} target="_blank" rel="noopener noreferrer">
                                            {job.companyName}
                                        </a>
                                    ) : (
                                        job.companyName
                                    )}
                                </td>
                                <td>{job.position}</td>
                                <td>
                                    <StatusBadge status={job.status} />
                                </td>
                                <td>
                                    {job.createdAt
                                        ? new Date(job.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                        : ''}
                                </td>
                                <td>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() =>
                                            setExpandedJobId(job.id === expandedJobId ? null : job.id)
                                        }
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
                                            onUpdateJob={(updated) => {
                                                if (updated.deleted) {
                                                    removeJobFromList(updated.id);
                                                } else {
                                                    updateJobInList(updated);
                                                }
                                                setExpandedJobId(null);
                                            }}
                                            formatForDateTimeLocal={formatDateTimeLocal}
                                        />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
