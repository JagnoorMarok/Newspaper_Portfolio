import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import CoffeeStain from '../components/CoffeeStain';

export default function Classifieds() {
  const ads = [
    {
      title: "SEEKING EMPLOYMENT",
      content: "Energetic and highly capable WEB DEVELOPER seeking freelance opportunities. Specializing in crafting bespoke digital experiences for LOCAL BUSINESSES. Will build you a website that stands out in the modern age.",
      contact: "Inquire via Telegraph (Contact Page)",
      highlight: true
    },
    {
      title: "SERVICES OFFERED",
      content: "Mastery of the modern web stack guaranteed. Services include but are not limited to:",
      list: [
        "React & Native",
        "TypeScript",
        "Node & Express",
        "Next.js Arch.",
        "Tailwind CSS",
        "UI/UX Design",
        "PostgreSQL",
        "Optimization"
      ],
      contact: "Rates Negotiable."
    },
    {
      title: "LOCATION / BASE OF OPERATIONS",
      content: "Currently operating out of INDIA. Available for remote dispatch globally. Capable of syncing across major timezones to ensure prompt delivery of services.",
      contact: "Send a carrier pigeon or an email."
    },
    {
      title: "PUBLIC NOTICE: LOST & FOUND",
      content: "LOST: Approximately 5 hours of precious sleep debugging a particularly stubborn CSS layout. If found, please return to the developer.",
      contact: "No questions asked."
    },
    {
      title: "PUBLIC NOTICE",
      content: "FOUND: A deep, unyielding passion for vintage web design and brutalist typography. Viewers are advised to browse the Gallery and Library at their own leisure.",
      contact: "Enjoy your stay."
    },
    {
      title: "WANTED: COFFEE",
      content: "High-octane fuel required to maintain current coding velocity. Generous benefactors who provide coffee will be rewarded with exceptionally clean code and witty commit messages.",
      contact: ""
    },
    {
      title: "FOR HIRE: PIXEL PUSHER",
      content: "Have a design that needs to be perfectly translated to the browser? Look no further. Every pixel will be placed with surgical precision.",
      contact: "Satisfaction Guaranteed."
    },
    {
      title: "REWARD OFFERED",
      content: "REWARD: A stunning, high-performing, and accessible website for whoever chooses to hire me for their next project.",
      contact: "Claim reward today.",
      highlight: true
    },
    {
      title: "PERSONAL AMBITION",
      content: "A dedicated patriot preparing for the ultimate test of service. Currently training and aspiring to earn a commission as a Military Officer in the esteemed Indian Armed Forces.",
      contact: "Service Before Self.",
      highlight: true
    }
  ];

  return (
    <>
      <SEO title="Classifieds" description="Skills, services, notices, and freelance availability by Jagnoor Singh Marok." />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto relative px-4 md:px-8 pb-16"
      >
        <CoffeeStain 
          id="stain-classifieds"
          positionClass="-left-4 md:left-8 top-[15vh]"
          alignSpill="left"
          secretMessage={
            <>
              <span className="text-[#e8dfc8] font-bold">Read the fine print.</span>
            </>
          }
        />
        
        <div className="py-8 border-b-[3px] border-double border-[var(--ink)] mb-8">
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-8xl tracking-[-0.03em] text-center uppercase">Classifieds</h1>
          <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--ink)] mt-4 text-center border-y border-[var(--ghost)] py-2 font-mono">
            Notices · Services · Seeking · Announcements
          </div>
        </div>

        {/* Masonry Layout for Classified Ads */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {ads.map((ad, index) => (
            <div 
              key={index} 
              className={`break-inside-avoid mb-6 border-[2px] ${ad.highlight ? 'border-[var(--ink)] border-[4px] bg-[var(--paper2)] shadow-md' : 'border-[var(--rule)]'} p-5 relative overflow-hidden`}
            >
              {ad.highlight && (
                <div className="absolute top-0 right-0 bg-[var(--ink)] text-[var(--paper)] text-[8px] font-mono uppercase px-2 py-1 tracking-widest">
                  Featured
                </div>
              )}
              
              <h2 className={`font-serif font-black ${ad.highlight ? 'text-2xl' : 'text-lg'} uppercase mb-3 leading-tight border-b border-[var(--ghost)] pb-2`}>
                {ad.title}
              </h2>
              
              <p className={`font-mono text-sm leading-[1.6] text-justify ${ad.highlight ? 'font-bold' : ''}`}>
                {ad.content}
              </p>
              
              {ad.list && (
                <ul className="mt-4 mb-2 border-y border-dashed border-[var(--ghost)] py-3 columns-2 gap-2">
                  {ad.list.map((item, i) => (
                    <li key={i} className="font-mono text-[10px] uppercase tracking-wider mb-2 break-inside-avoid text-center">
                      • {item}
                    </li>
                  ))}
                </ul>
              )}
              
              {ad.contact && (
                <div className="mt-4 pt-3 border-t border-double border-[var(--ghost)] font-serif italic text-sm text-center font-bold">
                  {ad.contact}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rule-ornament mt-12">— ✦ ✦ ✦ —</div>

      </motion.div>
    </>
  );
}
