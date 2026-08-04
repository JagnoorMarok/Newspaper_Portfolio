import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import MDEditor from '@uiw/react-md-editor';

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<'sketches' | 'posts' | 'messages' | 'links' | 'security'>('sketches');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) throw new Error('Invalid credentials');
      
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } catch (err) {
      setError('Incorrect password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-8 min-h-[60vh] flex items-center justify-center"
      >
        <div className="max-w-md w-full border-[3px] border-double border-[var(--rule)] p-8 bg-[var(--paper2)]">
          <h1 className="font-serif font-black text-3xl mb-2 text-center">Editor's Room</h1>
          <div className="text-[9px] tracking-[0.15em] uppercase text-[var(--muted)] text-center mb-8 border-b border-[var(--ghost)] pb-4">
            Authorized Personnel Only
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)]">Passphrase</label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="bg-[var(--paper)] border-b-2 border-[var(--ink)] p-2 font-mono outline-none focus:border-[var(--accent)] text-center tracking-widest w-full"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
                  title={showPassword ? "Hide passphrase" : "Show passphrase"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-xs text-[var(--accent)] font-mono text-center">{error}</div>}
            <button type="submit" disabled={loading} className="btn-action primary mt-4 py-3">
              {loading ? 'Verifying...' : 'Unlock'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="container mx-auto px-8 max-w-5xl"
    >
      <div className="py-8 border-b-[3px] border-double border-[var(--rule)] flex justify-between items-end">
        <div>
          <h1 className="font-serif font-black text-4xl tracking-[-0.02em] mb-1">Editor's Dashboard</h1>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">
            Manage your digital portfolio
          </div>
        </div>
        <button onClick={handleLogout} className="btn-action text-[10px]">Sign Out</button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--rule)] mb-8">
        {['sketches', 'posts', 'messages', 'links', 'security'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`whitespace-nowrap bg-transparent border-none border-r border-[var(--ghost)] px-4 md:px-6 py-3 font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-colors duration-150 first:border-l hover:bg-[var(--ink)] hover:text-[var(--paper)] ${activeTab === tab ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--muted)]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-12">
        {activeTab === 'sketches' && <ManageSketches token={token} />}
        {activeTab === 'posts' && <ManagePosts token={token} />}
        {activeTab === 'messages' && <ManageMessages token={token} />}
        {activeTab === 'links' && <ManageLinks token={token} />}
        {activeTab === 'security' && <ManageSecurity token={token} />}
      </div>
    </motion.div>
  );
}

// Subcomponents for the dashboard (placeholders that can be built out further)

function ManageSketches({ token }: { token: string }) {
  const [sketches, setSketches] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', medium: '', year: '', purchaseUrl: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sketches`)
      .then(res => res.json())
      .then(res => setSketches(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('medium', formData.medium);
    data.append('year', formData.year);
    data.append('purchaseUrl', formData.purchaseUrl);
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    const url = editingId ? `${API_BASE_URL}/api/sketches/${editingId}` : `${API_BASE_URL}/api/sketches`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    
    if (res.ok) {
      const savedSketch = await res.json();
      if (editingId) {
        setSketches(sketches.map(s => s.id === editingId ? savedSketch : s));
      } else {
        setSketches([savedSketch, ...sketches]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', category: '', description: '', medium: '', year: '', purchaseUrl: '' });
      setImageFile(null);
    }
  };

  const handleEdit = (sketch: any) => {
    setFormData({
      title: sketch.title || '',
      category: sketch.category || '',
      description: sketch.description || '',
      medium: sketch.medium || '',
      year: sketch.year || '',
      purchaseUrl: sketch.purchaseUrl || ''
    });
    setEditingId(sketch.id);
    setIsAdding(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sketch?')) return;
    const res = await fetch(`${API_BASE_URL}/api/sketches/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setSketches(sketches.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif font-bold text-2xl mb-1">Sketches Archive</h2>
          <p className="font-fell text-[var(--muted)]">Upload and manage your pencil works.</p>
        </div>
        {!isAdding && (
          <button onClick={() => {
            setFormData({ title: '', category: '', description: '', medium: '', year: '', purchaseUrl: '' });
            setEditingId(null);
            setIsAdding(true);
          }} className="btn-action primary">Add New Sketch</button>
        )}
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 border-[3px] border-double border-[var(--rule)] p-6 bg-[var(--paper2)] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Title*</label>
            <input required type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Category*</label>
            <select required className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="" disabled>Select category...</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="figure">Figure</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] tracking-[0.15em] uppercase">Image File {editingId ? '(Leave empty to keep existing)' : '*'}</label>
            <input required={!editingId} type="file" accept="image/*" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" onChange={e => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Medium</label>
            <input type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.medium} onChange={e => setFormData({...formData, medium: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Year</label>
            <input type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] tracking-[0.15em] uppercase">Purchase URL</label>
            <input type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.purchaseUrl} onChange={e => setFormData({...formData, purchaseUrl: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] tracking-[0.15em] uppercase">Description</label>
            <textarea className="bg-[var(--paper)] border border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="md:col-span-2 flex gap-4 mt-2">
            <button type="submit" className="btn-action primary px-8">{editingId ? 'Update Sketch' : 'Save Sketch'}</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setImageFile(null); }} className="btn-action">Cancel</button>
          </div>
        </form>
      )}

      {sketches.length === 0 && !isAdding ? (
        <div className="border border-[var(--rule)] p-8 text-center bg-[var(--paper2)]">
          <p className="font-mono text-sm mb-4">No sketches found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sketches.map(s => (
            <div key={s.id} className="border border-[var(--ghost)] p-4 flex justify-between items-center bg-[var(--paper2)]">
              <div>
                <span className="font-serif font-bold block">{s.title}</span>
                <span className="text-[9px] font-mono text-[var(--muted)]">{s.category}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="btn-action text-[10px]">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="btn-action text-[10px] text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--paper)]">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManagePosts({ token }: { token: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', tag: '', excerpt: '', content: '', dateStr: '' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then(res => setPosts(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE_URL}/api/blogs/${editingId}` : `${API_BASE_URL}/api/blogs`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const savedPost = await res.json();
      if (editingId) {
        setPosts(posts.map(p => p.id === editingId ? savedPost : p));
      } else {
        setPosts([savedPost, ...posts]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', tag: '', excerpt: '', content: '', dateStr: '' });
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title || '',
      tag: post.tag || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      dateStr: post.dateStr || ''
    });
    setEditingId(post.id);
    setIsAdding(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif font-bold text-2xl mb-1">Bulletin Posts</h2>
          <p className="font-fell text-[var(--muted)]">Write and edit your thoughts and articles.</p>
        </div>
        {!isAdding && (
          <button onClick={() => {
            setFormData({ title: '', tag: '', excerpt: '', content: '', dateStr: '' });
            setEditingId(null);
            setIsAdding(true);
          }} className="btn-action primary">Draft New Post</button>
        )}
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 border-[3px] border-double border-[var(--rule)] p-6 bg-[var(--paper2)] flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Title*</label>
            <input required type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] uppercase">Tag*</label>
              <select required className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}>
                <option value="" disabled>Select a tag...</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Reflection">Reflection</option>
                <option value="Academy">Academy</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] uppercase">Date String*</label>
              <input required type="text" className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none placeholder:text-[var(--ghost)]" placeholder="e.g. October 15, 2024" value={formData.dateStr} onChange={e => setFormData({...formData, dateStr: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Excerpt*</label>
            <textarea required className="bg-[var(--paper)] border border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none min-h-[60px]" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[0.15em] uppercase">Full Content* (Markdown & HTML allowed)</label>
            <div data-color-mode="dark" className="border border-[var(--ghost)] focus-within:border-[var(--accent)]">
              <MDEditor
                value={formData.content}
                onChange={(val) => setFormData({...formData, content: val || ''})}
                height={400}
                className="bg-[var(--paper)] font-mono"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="btn-action primary px-8">{editingId ? 'Update Post' : 'Publish Post'}</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="btn-action">Cancel</button>
          </div>
        </form>
      )}

      {posts.length === 0 && !isAdding ? (
        <div className="border border-[var(--rule)] p-8 text-center bg-[var(--paper2)]">
          <p className="font-mono text-sm mb-4">No posts found in the database.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(p => (
            <div key={p.id} className="border border-[var(--ghost)] p-4 flex justify-between items-center bg-[var(--paper2)]">
              <div>
                <span className="font-serif font-bold block">{p.title}</span>
                <span className="text-[9px] font-mono text-[var(--muted)]">{p.dateStr}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="btn-action text-[10px]">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn-action text-[10px] text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--paper)]">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageMessages({ token }: { token: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setMessages(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  return (
    <div>
      <h2 className="font-serif font-bold text-2xl mb-4">Incoming Dispatches</h2>
      <p className="font-fell text-[var(--muted)] mb-6">Messages sent from the Contact page.</p>
      
      {loading ? (
        <div className="font-mono text-sm text-[var(--muted)]">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="border border-[var(--rule)] p-8 text-center bg-[var(--paper2)]">
          <p className="font-mono text-sm">The inbox is currently empty.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg: any) => (
            <div key={msg.id} className="border border-[var(--ghost)] p-4 bg-[var(--paper2)]">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--ghost)]">
                <span className="font-serif font-bold">{msg.name}</span>
                <span className="text-[9px] font-mono text-[var(--muted)] tracking-widest">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs font-mono text-[var(--accent)]">{msg.email} · {msg.type}</div>
                <button 
                  onClick={() => handleDelete(msg.id)} 
                  className="btn-action text-[10px] text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--paper)] py-1 px-3"
                >
                  Delete
                </button>
              </div>
              <p className="font-fell text-sm leading-[1.5] whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageLinks({ token }: { token: string }) {
  const [formData, setFormData] = useState({ instagram: '', linkedin: '', github: '' });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
          github: data.github || ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('Settings updated successfully.');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Error updating settings.');
      }
    } catch {
      setStatus('Error updating settings.');
    }
  };

  return (
    <div>
      <h2 className="font-serif font-bold text-2xl mb-4">External Links</h2>
      <p className="font-fell text-[var(--muted)] mb-6">Manage the URLs displayed on your Contact page.</p>
      
      {loading ? (
        <div className="font-mono text-sm text-[var(--muted)]">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="border-[3px] border-double border-[var(--rule)] p-6 bg-[var(--paper2)] max-w-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] uppercase">Instagram URL</label>
              <input 
                type="url" 
                className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" 
                value={formData.instagram} 
                onChange={e => setFormData({...formData, instagram: e.target.value})} 
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] uppercase">LinkedIn URL</label>
              <input 
                type="url" 
                className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" 
                value={formData.linkedin} 
                onChange={e => setFormData({...formData, linkedin: e.target.value})} 
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] uppercase">GitHub URL</label>
              <input 
                type="url" 
                className="bg-[var(--paper)] border-b border-[var(--ghost)] p-2 font-mono text-sm focus:border-[var(--accent)] outline-none" 
                value={formData.github} 
                onChange={e => setFormData({...formData, github: e.target.value})} 
                placeholder="https://github.com/..."
              />
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <button type="submit" className="btn-action primary px-8">Save Changes</button>
              {status && <span className="text-[10px] tracking-widest font-mono text-[var(--accent)]">{status}</span>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function ManageSecurity({ token }: { token: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-serif font-bold text-2xl mb-4">Security Settings</h2>
      <p className="font-fell text-[var(--muted)] mb-6">Change your administrator passphrase.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)]">Current Passphrase</label>
          <input 
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="bg-[var(--paper)] border-b-2 border-[var(--ink)] p-2 font-mono outline-none focus:border-[var(--accent)]"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)]">New Passphrase</label>
          <input 
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="bg-[var(--paper)] border-b-2 border-[var(--ink)] p-2 font-mono outline-none focus:border-[var(--accent)]"
            required
          />
        </div>

        {error && <div className="text-xs text-[var(--accent)] font-mono">{error}</div>}
        {message && <div className="text-xs text-[var(--ink)] font-mono">{message}</div>}

        <button type="submit" disabled={loading} className="btn-action primary mt-4 py-3">
          {loading ? 'Updating...' : 'Change Passphrase'}
        </button>
      </form>
    </div>
  );
}
