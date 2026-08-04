import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  dateStr: string;
  published: boolean;
  createdAt: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs?limit=5`)
      .then(res => res.json())
      .then(res => {
        setPosts(res.data || []);
        setHasMore(res.hasMore || false);
      })
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  const loadMore = () => {
    if (!posts.length) return;
    const lastPost = posts[posts.length - 1];
    fetch(`${API_BASE_URL}/api/blogs?limit=5&cursor=${lastPost.id}`)
      .then(res => res.json())
      .then(res => {
        setPosts(prev => [...prev, ...(res.data || [])]);
        setHasMore(res.hasMore || false);
      })
      .catch(err => console.error('Error fetching more blogs:', err));
  };

  if (viewingPost) {
    return (
      <>
        <SEO title={viewingPost.title} description={viewingPost.excerpt} type="article" />
        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="max-w-[720px] mx-auto p-8"
      >
        <button 
          onClick={() => setViewingPost(null)}
          className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-8 border-b border-[var(--ghost)] hover:text-[var(--ink)] transition-colors pb-1"
        >
          ← Return to Bulletin
        </button>
        <div className="border-b-[3px] border-double border-[var(--rule)] pb-6 mb-8">
          {viewingPost.tag && (
            <div className="inline-block text-[9px] tracking-[0.2em] uppercase bg-[var(--ink)] text-[var(--paper)] py-[2px] px-2 mb-3">
              {viewingPost.tag}
            </div>
          )}
          <h1 className="font-serif font-black text-4xl md:text-5xl tracking-[-0.03em] mb-4 text-center md:text-left leading-tight">{viewingPost.title}</h1>
          <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-8 text-center md:text-left border-b border-[var(--ghost)] pb-4">
            Published {viewingPost.dateStr}
          </div>
          
          <div className="prose prose-invert max-w-none font-fell text-[1.1rem] leading-[1.8] text-[var(--muted)] markdown-body">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {viewingPost.content}
            </ReactMarkdown>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[var(--rule)] text-center">
            <button onClick={() => setViewingPost(null)} className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)]">Close Bulletin</button>
          </div>
        </div>
      </motion.div>
      </>
    );
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
    <SEO title="Bulletin" description="Thoughts, reflections, and writings by Jagnoor Singh Marok." />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto"
    >
      <div className="p-8 border-b-2 border-[var(--rule)] grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
        <div>
          <div className="text-[9px] tracking-[0.2em] uppercase text-[var(--muted)] mb-1">Personal Dispatches from the Academy</div>
          <h1 className="font-serif font-black text-5xl tracking-[-0.03em]">The Bulletin</h1>
        </div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-[var(--muted)]">Latest Entries</div>
      </div>

      {featuredPost ? (
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-0 border-b-2 border-[var(--rule)]">
          <div className="p-8 border-r border-[var(--rule)]">
            {featuredPost.tag && (
              <div className="inline-block text-[9px] tracking-[0.2em] uppercase bg-[var(--ink)] text-[var(--paper)] py-[2px] px-2 mb-2">
                {featuredPost.tag}
              </div>
            )}
            <h2 onClick={() => setViewingPost(featuredPost)} className="font-serif font-black text-4xl leading-[1.05] tracking-[-0.02em] mb-2 cursor-pointer hover:underline decoration-[var(--accent)]">
              {featuredPost.title}
            </h2>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-4 pb-2 border-b border-[var(--ghost)]">
              Published on {featuredPost.dateStr}
            </div>
            <p className="font-fell text-base leading-[1.7] text-justify">{featuredPost.excerpt}</p>
          </div>
          <div className="p-8 bg-[var(--paper2)] flex flex-col gap-6">
            <div className="border border-[var(--rule)] p-4">
              <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">Recent Dispatches</h3>
              <ul className="list-none p-0 text-[0.78rem] leading-[1.6] text-[var(--muted)]">
                {otherPosts.slice(0, 3).map(post => (
                  <li key={post.id} onClick={() => setViewingPost(post)} className="py-1 border-b border-[var(--paper3)] last:border-none cursor-pointer hover:text-[var(--ink)] before:content-['—_'] before:text-[var(--accent)]">
                    {post.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[var(--rule)] p-4">
              <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">Categories</h3>
              <ul className="list-none p-0 text-[0.78rem] leading-[1.6] text-[var(--muted)]">
                {['Technology', 'Art', 'Reflection', 'Academy'].map(cat => (
                  <li key={cat} className="py-1 border-b border-[var(--paper3)] last:border-none cursor-pointer hover:text-[var(--ink)] before:content-['—_'] before:text-[var(--accent)]">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-[var(--muted)] py-12 font-fell italic border-b-2 border-[var(--rule)]">
          No bulletins have been published yet. Check back soon.
        </div>
      )}

      {otherPosts.length > 0 && (
        <>
          <div className="text-center my-8 text-[var(--muted)] text-xl tracking-[0.5em]">— ✦ ✦ ✦ —</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--rule)] border border-[var(--rule)] border-t-0 mx-8 mb-8">
            {otherPosts.map((post, idx) => (
              <div key={post.id} onClick={() => setViewingPost(post)} className="bg-[var(--paper)] p-6 cursor-pointer transition-colors duration-150 hover:bg-[var(--paper3)]">
                {post.tag && (
                  <div className="inline-block text-[9px] tracking-[0.2em] uppercase bg-[var(--ink)] text-[var(--paper)] py-[2px] px-2 mb-2">
                    {post.tag}
                  </div>
                )}
                <h3 className="font-serif font-bold text-lg leading-[1.2] mb-2 hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                <div className="text-[9px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2">{post.dateStr}</div>
                <p className="text-sm leading-[1.6] text-[var(--muted)]">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {hasMore && (
        <div className="text-center pt-8 mt-12 border-t border-[var(--rule)]">
          <button onClick={loadMore} className="btn-action mx-auto">Load Older Bulletins</button>
        </div>
      )}
    </motion.div>
    </>
  );
}
