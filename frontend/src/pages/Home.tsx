import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import meImg from '../assets/me.jpeg';
import GuestbookDrawer from '../components/GuestbookDrawer';
import CoffeeStain from '../components/CoffeeStain';

export default function Home() {
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  return (
    <>
      <SEO title="Home" />
      <GuestbookDrawer isOpen={isGuestbookOpen} onClose={() => setIsGuestbookOpen(false)} />
      
      <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-8 relative"
    >
      <CoffeeStain 
        id="stain-home"
        positionClass="-right-4 md:right-12 top-64"
        alignSpill="right"
        secretMessage={
          <>
            <span className="text-[#e8dfc8] font-bold">I am Batman.</span>
          </>
        }
      />
      
      <div className="text-center py-12 px-8 border-b-[3px] border-double border-[var(--rule)]">
        <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] mb-2">
          Vol. I — The Portfolio Edition
        </div>
        <div className="font-serif font-black text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] mb-2">
          Jagnoor Singh Marok
        </div>
        <br></br>
        <div className="font-fell italic text-lg text-[var(--muted)] tracking-[0.05em] mb-4">
          Computer Engineer · Designer · Soldier in Waiting · Sketcher of Worlds
        </div>
        
        {/* Letters to the Editor Prompt */}
        <div className="my-8 border-y border-[var(--rule)] py-4 max-w-2xl mx-auto cursor-pointer group" onClick={() => setIsGuestbookOpen(true)}>
          <div className="font-serif font-bold text-lg uppercase tracking-widest text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-2">
            The Public Ledger
          </div>
          <p className="font-fell text-[1rem] text-[var(--muted)] leading-relaxed italic group-hover:text-[var(--ink)] transition-colors">
            Our readers are cordially invited to submit their thoughts, queries, or commendations to the editorial desk. Click here to read recent missives or pen your own letter to the Editor.
          </p>
        </div>

      </div>
      <div className="h-2 bg-[var(--ink)] w-full m-0"></div>

      <div className="grid grid-cols-3 border-b border-[var(--rule)]">
        <div className="py-2.5 px-6 text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] text-center border-r border-[var(--rule)]">
          NIT Jalandhar · B.Tech CSE
        </div>
        <div className="py-2.5 px-6 text-[12px] font-serif italic text-[var(--accent)] text-center">
          Est. 2004 · Punjab, India
        </div>
        <div className="py-2.5 px-6 text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] text-center border-l border-[var(--rule)]">
          Web Dev · ML · UI/UX · Basketball
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] border-b-2 border-[var(--rule)]">
        <div className="p-8 md:border-r border-[var(--rule)]">
          <h1 className="font-serif font-black text-4xl leading-[1.05] tracking-[-0.02em] mb-4">
            A Scholar of Systems, an Architect of Solutions
          </h1>
          <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-4 pb-2 border-b border-[var(--ghost)]">
            By The Editorial Staff &nbsp;·&nbsp; Special Edition &nbsp;·&nbsp; Portfolio Vol. I
          </div>
          <p className="font-fell text-[1.05rem] leading-[1.7] mb-4 text-justify">
            <span className="font-serif font-black text-6xl leading-[0.8] float-left mr-2 mt-1 text-[var(--accent)]">J</span>
            agnoor Singh Marok is a student of Computer Engineering at Dr. B. R. Ambedkar National Institute of Technology, Jalandhar — an institution of national eminence — where he pursues the discipline with uncommon rigour and intellectual ambition. His principal interests span the breadth of modern computing: web development, interaction design, the architecture of data structures, and the emergent science of machine learning.
          </p>
          <div className="font-serif italic text-2xl leading-[1.3] border-y-[3px] border-[var(--ink)] py-4 my-6 text-[var(--accent)]">
            "To understand how systems work at their deepest level — and to use that knowledge to build things that endure."
          </div>
          <p className="font-fell text-[1.05rem] leading-[1.7] text-justify mb-4">
            What distinguishes his approach is not merely technical aptitude, but a philosophic disposition toward systems-thinking. He is drawn to the hidden mechanics that animate complex structures, seeking always to comprehend a technology at its foundations before presuming to extend or improve it. This orientation yields solutions that are efficient, scalable, and resolutely centred upon the human beings who must ultimately employ them.
          </p>
        </div>

        <div className="p-8 border-t md:border-t-0 border-[var(--rule)]">
          <div className="border border-[var(--rule)] p-4 mb-6">
            <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">Fields of Study</h3>
            <ul className="list-none p-0">
              {['Web Development', 'UI/UX Design', 'Data Structures & Algorithms', 'Machine Learning', 'Systems Architecture'].map((item) => (
                <li key={item} className="text-[0.78rem] leading-[1.6] text-[var(--muted)] py-1 border-b border-[var(--paper3)] last:border-0 before:content-['—_'] before:text-[var(--accent)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[var(--rule)] p-4 mb-6">
            <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">Beyond the Classroom</h3>
            <p className="text-[0.78rem] leading-[1.6] text-[var(--muted)]">
              Basketball disciplines the body as mathematics disciplines the mind — both demanding precision, endurance, and the willingness to fail before succeeding. Sketching, meanwhile, offers a meditative counterpoint: the slow, deliberate recording of the world through a graphite medium.
            </p>
          </div>
          <div className="border border-[var(--rule)] p-4">
            <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">A Higher Calling</h3>
            <p className="text-[0.78rem] leading-[1.6] text-[var(--muted)]">
              His ultimate ambition is service to the Indian nation through commissioning in the Indian Army — a vocation demanding the very qualities he cultivates daily: discipline, integrity, and unwavering dedication to a cause larger than oneself.
            </p>
          </div>
        </div>
      </div>

      <div className="rule-ornament">— ✦ ✦ ✦ —</div>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr_2fr] border-b border-[var(--rule)]">
        <div className="p-8 md:border-r border-[var(--rule)]">
          <h2 className="font-serif font-bold text-2xl mb-4">The Making of a Computer Engineer</h2>
          <p className="font-fell text-[0.95rem] leading-[1.7] mb-3 text-justify">
            At its core, Jagnoor's academic pursuit is an exercise in understanding causality within complex systems. Where many students approach computer engineering as a vocational exercise — a means to an employable end — he approaches it as a natural philosopher might: through sustained inquiry into first principles.
          </p>
          <p className="font-fell text-[0.95rem] leading-[1.7] mb-3 text-justify">
            His study of data structures is inseparable from his interest in efficiency; his exploration of machine learning, inseparable from questions of epistemology and the nature of pattern-recognition. It is, in the truest sense, an interdisciplinary vocation — one that draws equally from mathematics, logic, and the humanistic concern for usability and experience.
          </p>
        </div>

        <div className="p-6 md:border-r border-[var(--rule)] flex flex-col items-center">
          <div className="w-full aspect-[3/4] bg-[var(--paper2)] border border-[var(--rule)] flex items-center justify-center overflow-hidden relative">
            <img src={meImg} alt="Jagnoor Singh Marok" className="w-full h-full object-cover grayscale-[20%] contrast-[1.05]" />
          </div>
          <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--ghost)] text-center mt-2">
            J. S. Marok · NIT Jalandhar
          </div>
        </div>

        <div className="p-8">
          <h2 className="font-serif font-bold text-2xl mb-4">The Artist Within the Engineer</h2>
          <p className="font-fell text-[0.95rem] leading-[1.7] mb-3 text-justify">
            That Jagnoor sketches by hand is not a curiosity but a coherence. The same analytical sensibility that renders him adept at algorithm design — the capacity to perceive structure, to discern proportion, to isolate what is essential — manifests itself in his graphite studies of the human form and the natural world.
          </p>
          <p className="font-fell text-[0.95rem] leading-[1.7] mb-3 text-justify">
            Art and engineering are not opposing disciplines; they are dialects of the same underlying language: the pursuit of clarity, the elimination of the superfluous, and the honest rendering of reality as it is.
          </p>
        </div>
      </div>
      <div className="rule-ornament">— ✦ ✦ ✦ —</div>
    </motion.div>
    </>
  );
}
