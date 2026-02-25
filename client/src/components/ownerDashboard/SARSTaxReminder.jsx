import React, { useState, useEffect } from 'react';
import { useGetSARSDeadlinesQuery } from '../../store/api/ownerApi';

const SARSTaxReminder = () => {
  const { data: deadlines, isLoading } = useGetSARSDeadlinesQuery();
  const [nextDeadline, setNextDeadline] = useState(null);

  useEffect(() => {
    if (deadlines) {
      // Find the closest upcoming deadline
      const now = new Date();
      const upcoming = deadlines
        .filter(d => new Date(d.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
      setNextDeadline(upcoming);
    }
  }, [deadlines]);

  if (isLoading) return <div>Loading tax reminders...</div>;

  const daysUntil = nextDeadline 
    ? Math.ceil((new Date(nextDeadline.date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="tax-reminder-card" style={{
      background: 'var(--secondary)',
      borderLeft: `4px solid ${daysUntil && daysUntil < 7 ? 'var(--accent)' : 'var(--primary)'}`,
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    }}>
      <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
        ⚖️ SARS Tax Deadlines
      </h3>
      
      {nextDeadline ? (
        <>
          <p style={{ fontSize: '1.1rem' }}>
            <strong>Next Deadline:</strong> {new Date(nextDeadline.date).toLocaleDateString('en-ZA')}
            {daysUntil && (
              <span style={{ 
                color: daysUntil < 7 ? 'var(--accent)' : 'var(--primary)',
                fontWeight: 'bold',
                marginLeft: '0.5rem'
              }}>
                ({daysUntil} days left)
              </span>
            )}
          </p>
          <p><strong>Type:</strong> {nextDeadline.type}</p>
          <p><strong>Description:</strong> {nextDeadline.description}</p>
          
          {daysUntil && daysUntil < 7 && (
            <div style={{
              background: 'var(--accent)',
              color: 'var(--text-light)',
              padding: '0.5rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              ⚠️ Deadline approaching! Prepare your documents now.
            </div>
          )}
        </>
      ) : (
        <p>No upcoming deadlines found.</p>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h4>Upcoming Deadlines:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {deadlines?.map((deadline, index) => (
            <li key={index} style={{
              padding: '0.25rem 0',
              borderBottom: '1px solid #ddd'
            }}>
              {new Date(deadline.date).toLocaleDateString('en-ZA')} - {deadline.type}: {deadline.description}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        <p>
          <strong>Note:</strong> As a startup with revenue below R1 million/year, 
          you're not required to register for VAT [citation:2]. These reminders are for 
          Provisional Tax and Income Tax returns.
        </p>
        <p>
          File via <a href="https://sarsefiling.co.za" target="_blank" rel="noopener noreferrer" 
          style={{ color: 'var(--primary)' }}>SARS eFiling</a>
        </p>
      </div>
    </div>
  );
};

export default SARSTaxReminder;
