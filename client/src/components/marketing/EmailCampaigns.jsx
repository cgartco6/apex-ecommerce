import React, { useState } from 'react';
import { useGetEmailCampaignsQuery, useCreateEmailCampaignMutation } from '../../store/api/marketingApi';
import toast from 'react-hot-toast';

const EmailCampaigns = () => {
  const { data: campaigns, isLoading } = useGetEmailCampaignsQuery();
  const [createCampaign] = useCreateEmailCampaignMutation();
  const [form, setForm] = useState({ name: '', subject: '', content: '', recipients: '' });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createCampaign({ ...form, recipients: form.recipients.split(',').map(s => s.trim()) }).unwrap();
      toast.success('Campaign created');
      setForm({ name: '', subject: '', content: '', recipients: '' });
    } catch (err) {
      toast.error('Error creating campaign');
    }
  };

  return (
    <div>
      <h2>Email Campaigns</h2>
      <form onSubmit={submitHandler} style={{ marginBottom: '2rem' }}>
        <input placeholder="Campaign Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
        <textarea placeholder="Email Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
        <input placeholder="Recipients (comma separated emails)" value={form.recipients} onChange={e => setForm({...form, recipients: e.target.value})} required />
        <button type="submit" className="btn-primary">Create Campaign</button>
      </form>

      <h3>Existing Campaigns</h3>
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {campaigns?.map(c => (
            <li key={c._id}>{c.name} - {c.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailCampaigns;
