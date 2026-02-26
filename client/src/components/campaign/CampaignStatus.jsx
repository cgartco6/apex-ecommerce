import React from 'react';
import { useGetClientCampaignsQuery } from '../../store/api/campaignApi';

const CampaignStatus = () => {
  const { data: campaigns } = useGetClientCampaignsQuery();
  return (
    <div className="card">
      <h2>My Campaigns</h2>
      <table>
        <thead><tr><th>Name</th><th>Status</th><th>Impressions</th><th>Clicks</th></tr></thead>
        <tbody>
          {campaigns?.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.performance?.impressions}</td>
              <td>{c.performance?.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
