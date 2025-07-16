import React from 'react';

export const statusColors = {
    APPLIED: '#cfe2ff',
    HR_SCREEN: '#ffe5b4',
    TECHNICAL_INTERVIEW: '#d1e7dd',
    FINAL_INTERVIEW: '#e0bbff',
    OFFERED: '#d1e7dd',
    ACCEPTED: '#b6f0c1',
    REJECTED: '#f8d7da',
    WITHDRAWN: '#f8d7da',
};


export default function StatusBadge({ status }) {
    const bgColor = statusColors[status] || '#e2e3e5';

    return (
        <span style={{
            backgroundColor: bgColor,
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-block',
            minWidth: '60px',
            textAlign: 'center',
        }}>
      {status}
    </span>
    );
}
