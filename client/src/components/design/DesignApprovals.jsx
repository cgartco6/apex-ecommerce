import React from 'react';
import { useGetPendingDesignsQuery, useApproveDesignMutation } from '../../store/api/designApi';

const DesignApprovals = () => {
  const { data: designs } = useGetPendingDesignsQuery();
  const [approve] = useApproveDesignMutation();

  return (
    <div className="card">
      <h2>Designs Awaiting Approval</h2>
      {designs?.map(d => (
        <div key={d._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <img src={d.previewUrl} alt={d.name} width="100" />
          <div>
            <h4>{d.name}</h4>
            <button onClick={() => approve({ id: d._id, approved: true })}>Approve</button>
            <button onClick={() => approve({ id: d._id, approved: false })}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
