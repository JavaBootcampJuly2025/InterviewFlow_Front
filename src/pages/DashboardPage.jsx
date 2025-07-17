import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import './Dashboard.css';
import { mockJobApplications } from '../mockData.js';
import { validateApplications } from '../utlis/validateApplications.js';
import ApplicationEditForm from '../components/ApplicationEditForm.jsx';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';

export default function DashboardPage({ setUser }) {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [addingJob, setAddingJob] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    // Redirect to login if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setErrors([]);
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));
                const data = mockJobApplications;
                const validJobs = validateApplications(data);
                setJobs(validJobs);
            } catch (err) {
                const newMsg = err.message || 'Unknown error';
                setErrors((prev) => (prev.includes(newMsg) ? prev : [...prev, newMsg]));
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
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

    function formatForDateTimeLocal(isoString) {
        if (!isoString) return '';
        return isoString.substring(0, 16);
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
                <h1>Dashboard</h1>
                <Button variant="primary" onClick={() => setAddingJob(true)}>
                    Add Job
                </Button>

                {addingJob && (
                    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
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
                    {jobs.map((job) => (
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
                                <td>
                                    <StatusBadge status={job.status} />
                                </td>
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
        </Layout>
    );
}
