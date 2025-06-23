import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pinned, setPinned] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    const res = await fetch('/api/notes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const noteData = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      pinned
    };
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`/api/notes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(noteData)
        });
      } else {
        res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(noteData)
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error saving note');
      setTitle(''); setContent(''); setTags(''); setPinned(false); setEditingId(null);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setPinned(note.pinned);
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotes();
  };

  const handlePin = async (note) => {
    await fetch(`/api/notes/${note._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...note, pinned: !note.pinned })
    });
    fetchNotes();
  };

  const filteredNotes = filterTag
    ? notes.filter(n => n.tags.includes(filterTag))
    : notes;

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
        <h1 className="text-2xl font-bold tracking-tight">Notes Manager</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold transition">Logout</button>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <form className="bg-gray-800 p-6 rounded-lg shadow mb-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="flex-1 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="flex-1 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} className="accent-blue-500" /> Pin
            </label>
          </div>
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
          <div className="flex gap-4 items-center">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold transition">{editingId ? 'Update' : 'Add'} Note</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setTags(''); setPinned(false); }} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-semibold transition">Cancel</button>}
            {error && <div className="text-red-400">{error}</div>}
          </div>
        </form>
        <div className="mb-6 flex items-center gap-2">
          <span className="text-gray-400">Filter by tag:</span>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="bg-gray-800 text-white rounded p-2">
            <option value="">All</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredNotes.map(note => (
            <div key={note._id} className={`relative bg-gray-800 rounded-lg shadow p-5 flex flex-col gap-2 border-2 ${note.pinned ? 'border-yellow-400' : 'border-transparent'}`}>
              {note.pinned && <span className="absolute top-2 right-2 text-yellow-400">📌</span>}
              <h3 className="text-xl font-semibold mb-1">{note.title}</h3>
              <p className="text-gray-200 mb-2 whitespace-pre-line">{note.content}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {note.tags.map(tag => <span key={tag} className="bg-blue-700 text-xs px-2 py-1 rounded text-white">{tag}</span>)}
              </div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleEdit(note)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm">Edit</button>
                <button onClick={() => handleDelete(note._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Delete</button>
                <button onClick={() => handlePin(note)} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-sm">{note.pinned ? 'Unpin' : 'Pin'}</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 