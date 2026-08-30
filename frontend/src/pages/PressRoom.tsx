import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import CoffeeStain from '../components/CoffeeStain';
import { API_BASE_URL } from '../config';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  techStack: string;
  content: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
};

const ensureAbsoluteUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function PressRoom() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then(res => res.json())
      .then(res => {
        setProjects(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
        setLoading(false);
      });
  }, []);

  const headlineProject = projects.length > 0 ? projects[0] : null;
  const otherProjects = projects.length > 1 ? projects.slice(1) : [];

  return (
    <>
      <SEO title="The Press Room" description="Featured projects and headline web developments by Jagnoor Singh Marok." />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto relative px-4 md:px-8 pb-16"
      >
        <CoffeeStain 
          id="stain-pressroom"
          positionClass="-right-8 md:right-12 top-[10vh]"
          alignSpill="right"
          secretMessage={
            <>
              <span className="text-[#e8dfc8] font-bold">Extra! Extra!</span>
            </>
          }
        />
        
        <div className="py-8 border-b-[3px] border-double border-[var(--ink)] mb-8">
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-8xl tracking-[-0.03em] text-center uppercase">The Press Room</h1>
          <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--ink)] mt-4 text-center border-y border-[var(--ghost)] py-2 font-mono">
            Breaking News · Featured Projects · Technical Reports
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[var(--muted)]">
            <div className="w-8 h-8 border-[3px] border-[var(--ghost)] border-t-[var(--ink)] rounded-full animate-spin mb-4"></div>
            <span className="font-mono text-xs uppercase tracking-widest">Waiting for the morning paper...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center text-[var(--muted)] border-y border-dashed border-[var(--ghost)]">
            <p className="font-serif italic text-2xl mb-2">No news is good news.</p>
            <p className="font-mono text-[10px] uppercase tracking-widest">Check back later for the latest developments.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Headline Project */}
            {headlineProject && (
              <div 
                className="border-b-[3px] border-double border-[var(--ink)] pb-12 cursor-pointer group"
                onClick={() => setSelectedProject(headlineProject)}
              >
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-bold border-b border-[var(--accent)] pb-2 inline-block self-start">
                    Breaking Story
                  </div>
                  <h2 className="font-serif font-black text-5xl md:text-6xl leading-[0.95] tracking-tight mb-6 group-hover:text-[var(--accent)] transition-colors">
                    {headlineProject.title}
                  </h2>
                  <p className="font-fell italic text-2xl text-[var(--muted)] mb-6 leading-relaxed">
                    {headlineProject.subtitle}
                  </p>
                  <div className="font-mono text-sm uppercase tracking-widest text-[var(--ink)] border-t border-[var(--ghost)] pt-4 mt-auto">
                    Tech Stack: {headlineProject.techStack}
                  </div>
                </div>
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div className="flex flex-col gap-6">
                {otherProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="flex flex-col md:flex-row md:items-baseline gap-4 border-b border-[var(--rule)] pb-6 cursor-pointer group hover:bg-[var(--ghost)] transition-colors p-4 rounded-md"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex-grow">
                      <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--muted)] mb-2">
                        Local News
                      </div>
                      <h3 className="font-serif font-black text-2xl leading-tight mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-fell italic text-[var(--muted)] text-sm mb-0">
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--ink)] md:w-1/3 md:text-right">
                      {project.techStack}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-paper max-w-[900px] w-full max-h-[90vh] overflow-auto border-[4px] border-[var(--ink)] flex flex-col rounded-md shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b-[3px] border-double border-[var(--rule)] relative">
                  <button 
                    className="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-[var(--ink)] font-mono hover:text-[var(--accent)] transition-colors p-2"
                    onClick={() => setSelectedProject(null)}
                  >✕</button>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] font-mono mb-4 text-center">
                    Detailed Investigative Report
                  </div>
                  <h2 className="font-serif font-black text-4xl md:text-5xl leading-none text-center mb-4">
                    {selectedProject.title}
                  </h2>
                  <p className="font-fell italic text-xl md:text-2xl text-[var(--muted)] text-center max-w-2xl mx-auto">
                    {selectedProject.subtitle}
                  </p>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col items-center">

                  
                  <div className="w-full max-w-[800px] grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="font-serif font-black text-2xl mb-4 border-b border-[var(--ghost)] pb-2 uppercase tracking-wide">The Full Story</h3>
                      <div className="font-fell text-lg leading-relaxed text-[var(--ink)] text-justify whitespace-pre-wrap first-letter:text-6xl first-letter:font-serif first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-[var(--accent)]">
                        {selectedProject.content}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2 border-b border-dashed border-[var(--ghost)] pb-1">Built With</h4>
                        <p className="font-serif font-bold text-lg leading-tight">{selectedProject.techStack}</p>
                      </div>
                      
                      {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                        <div>
                           <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2 border-b border-dashed border-[var(--ghost)] pb-1">External Links</h4>
                           <div className="flex flex-col gap-2 mt-3">
                             {selectedProject.liveUrl && (
                               <a href={ensureAbsoluteUrl(selectedProject.liveUrl)} target="_blank" rel="noopener noreferrer" className="btn-action text-center block w-full text-xs py-2">
                                 View Live Site
                               </a>
                             )}
                             {selectedProject.githubUrl && (
                               <a href={ensureAbsoluteUrl(selectedProject.githubUrl)} target="_blank" rel="noopener noreferrer" className="bg-transparent border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors font-mono uppercase tracking-widest text-center block w-full text-xs py-2">
                                 Read Source Code
                               </a>
                             )}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {projects.length > 0 && <div className="rule-ornament mt-12">— ✦ ✦ ✦ —</div>}

      </motion.div>
    </>
  );
}
