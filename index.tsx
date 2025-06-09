import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    title: '',
    institution: '',
    duration: '',
    budget: '',
    abstract: '',
    objectives: ''
  });
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEvaluate = async () => {
    setLoading(true);
    const fullText = `
Title: ${form.title}
Institution: ${form.institution}
Duration: ${form.duration} months
Budget: €${form.budget}
Abstract: ${form.abstract}
Objectives: ${form.objectives}
`;

    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal: fullText })
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>PropoziA – Erasmus+ Evaluator</h1>
      <input name="title" placeholder="Project Title *" value={form.title} onChange={handleChange} />
      <input name="institution" placeholder="Lead Institution *" value={form.institution} onChange={handleChange} />
      <input name="duration" placeholder="Duration (months) *" value={form.duration} onChange={handleChange} />
      <input name="budget" placeholder="Total Budget (€) *" value={form.budget} onChange={handleChange} />
      <textarea name="abstract" placeholder="Project Abstract *" value={form.abstract} onChange={handleChange} />
      <textarea name="objectives" placeholder="Project Objectives *" value={form.objectives} onChange={handleChange} />
      <button onClick={handleEvaluate} disabled={loading}>{loading ? 'Evaluating...' : 'Evaluate with AI'}</button>
      {feedback.length > 0 && (
        <div>
          <h2>AI Evaluation:</h2>
          {feedback.map((item: any, idx: number) => (
            <div key={idx}><strong>{item.type}</strong>: {item.content}</div>
          ))}
        </div>
      )}
    </main>
  );
}