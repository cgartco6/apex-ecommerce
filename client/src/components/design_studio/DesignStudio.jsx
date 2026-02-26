import React, { useState } from 'react';
import { useCreateDesignProjectMutation } from '../../store/api/designApi';

const DesignStudio = () => {
  const [form, setForm] = useState({ name: '', type: 'billboard', style: 'modern', description: '' });
  const [create] = useCreateDesignProjectMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create(form);
    alert('Design project created! AI will start generating.');
  };

  return (
    <div className="container">
      <h1>Design Studio</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Project Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="billboard">Billboard</option>
          <option value="vehicle wrap">Vehicle Wrap</option>
          <option value="logo">Logo</option>
          <option value="poster">Poster</option>
        </select>
        <select value={form.style} onChange={e => setForm({...form, style: e.target.value})}>
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="futuristic">Futuristic</option>
          <option value="cartoon">Cartoon</option>
          <option value="animated">Animated</option>
          <option value="out of the box">Out of the Box</option>
        </select>
        <textarea placeholder="Describe what you want..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <button type="submit" className="btn-primary">Generate Designs</button>
      </form>
    </div>
  );
};
