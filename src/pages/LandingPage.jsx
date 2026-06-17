import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reviews, sampleProjects } from '../data/dummyData';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const heroWords = "The skills economy, reimagined.".split(" ");

  return (
    <div className="bg-white min-h-screen text-apple-black font-sans selection:bg-apple-black selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H14V9H7V11.5H13V14.5H7V18H15V21H4V6Z" fill="#1D1D1F"/>
              <path d="M9 3H19V6H12V8.5H18V11.5H12V15H20V18H9V3Z" fill="#AEAEB2"/>
            </svg>
            <span className="text-xl font-semibold text-apple-black tracking-tight">Elevate</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">How It Works</a>
            <Link to="/projects" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">Projects</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-apple-black transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-medium bg-apple-black text-white px-6 py-3 rounded-full hover:bg-[#333333] transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 flex flex-col justify-center items-center px-4 overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div variants={fadeUp} className="text-[12px] font-medium text-apple-gray tracking-[0.15em] uppercase mb-6">
            INTRODUCING ELEVATE
          </motion.div>
          <motion.h1 className="text-[64px] md:text-[96px] font-bold text-apple-black tracking-[-0.03em] leading-[1.05] mb-6 flex flex-wrap justify-center gap-x-4">
            {heroWords.map((word, idx) => (
              <motion.span key={idx} variants={fadeUp} className={word === "reimagined." ? "italic font-serif" : ""}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[19px] text-apple-gray mb-10 max-w-[560px] mx-auto leading-relaxed">
            Learn from students. Teach what you know. Build projects together.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-apple-black text-white rounded-full font-medium hover:bg-[#333333] transition-colors">
              Get Started →
            </button>
            <button onClick={() => navigate('/browse')} className="px-6 py-3 bg-transparent text-apple-black border border-apple-black rounded-full font-medium hover:bg-apple-bg transition-colors">
              Explore Skills
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Animated Skill Exchange Showcase */}
      <section className="pb-32 px-4 relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto relative h-[240px] flex justify-center items-center">
          {[
            { delay: 0, rotate: -3, x: -320, y: 0, skill1: "Python", skill2: "UI/UX Design" },
            { delay: 1, rotate: 0, x: 0, y: -20, skill1: "Machine Learning", skill2: "Web Development" },
            { delay: 2, rotate: 3, x: 320, y: 10, skill1: "Public Speaking", skill2: "Video Editing" }
          ].map((style, idx) => (
            <motion.div
              key={idx}
              initial={{ y: style.y, x: style.x, rotate: style.rotate }}
              animate={{ y: [style.y, style.y - 15, style.y] }}
              transition={{ repeat: Infinity, duration: 4, delay: style.delay, ease: "easeInOut" }}
              className={`absolute top-10 left-1/2 -ml-[150px] w-[300px] bg-white border border-apple-border rounded-[18px] p-6 shadow-sm ${idx !== 1 ? 'hidden md:block' : ''}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-apple-bg flex items-center justify-center text-lg">{idx === 0 ? "🐍" : idx === 1 ? "🤖" : "🗣️"}</div>
                <span className="text-apple-gray text-xl">↔</span>
                <div className="w-10 h-10 rounded-full bg-apple-bg flex items-center justify-center text-lg">{idx === 0 ? "🎨" : idx === 1 ? "💻" : "🎬"}</div>
              </div>
              <div className="flex justify-between text-sm font-medium text-apple-black">
                <span>{style.skill1}</span>
                <span>{style.skill2}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-apple-bg border-y border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20 text-center">
            <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">POWERFUL FEATURES</span>
            <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em]">Everything you need to grow.</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Skill Exchange", desc: "Connect with peers to teach and learn new skills directly.", icon: "↔", color: "bg-white" },
              { title: "Project Collaboration", desc: "Team up and build real-world projects to showcase your abilities.", icon: "🚀", color: "bg-white" },
              { title: "Progress Tracking", desc: "Monitor your learning journey and view active exchange sessions.", icon: "📈", color: "bg-white" },
              { title: "Reviews & Ratings", desc: "Build credibility with honest feedback from partners.", icon: "★", color: "bg-white" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeUp} className={`p-8 rounded-[24px] border border-apple-border ${feature.color}`}>
                <div className="w-12 h-12 rounded-full bg-apple-bg flex items-center justify-center text-xl mb-6">{feature.icon}</div>
                <h3 className="text-[21px] font-semibold text-apple-black mb-3">{feature.title}</h3>
                <p className="text-apple-gray text-[16px] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20">
            <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">HOW IT WORKS</span>
            <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em]">Three steps to your next skill.</h2>
          </motion.div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-apple-border"></div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-12 relative">
              {[
                { num: "01", title: "Create Profile", desc: "List the skills you have and the ones you want to learn." },
                { num: "02", title: "Find Match", desc: "Connect with fellow students offering complementary skills." },
                { num: "03", title: "Learn & Build", desc: "Start swapping skills, tracking progress, and elevating your career." }
              ].map((step, idx) => (
                <motion.div key={idx} variants={fadeUp} className="relative pt-8 md:pt-16 bg-white">
                  <div className="absolute top-0 md:-top-4 left-0 text-[120px] font-bold text-apple-bgdark leading-none -z-10">{step.num}</div>
                  <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-4">{step.title}</h3>
                  <p className="text-[17px] text-apple-gray leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-32 bg-apple-bg border-y border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">PROJECT COLLABORATION</span>
              <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em]">Build together.</h2>
            </div>
            <button onClick={() => navigate('/projects')} className="px-6 py-3 bg-transparent text-apple-black border border-apple-border rounded-full font-medium hover:border-apple-black transition-colors self-start md:self-auto">
              Explore Projects
            </button>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-8">
            {sampleProjects && sampleProjects.slice(0, 2).map((project) => (
              <motion.div key={project.id} variants={fadeUp} className="bg-white p-8 rounded-[24px] border border-apple-border flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[24px] font-semibold text-apple-black mb-2">{project.title}</h3>
                      <p className="text-[16px] text-apple-gray leading-relaxed mb-6">{project.tagline}</p>
                    </div>
                    <span className="px-3 py-1 bg-apple-bg text-apple-black text-xs font-semibold rounded-full uppercase tracking-wider">{project.category}</span>
                  </div>
                  <div className="space-y-3 mb-8">
                    <h4 className="text-sm font-semibold text-apple-gray uppercase tracking-wider">Open Roles:</h4>
                    {project.roles && project.roles.map(role => (
                      <div key={role.id} className="flex justify-between items-center py-2 border-b border-apple-border last:border-0">
                        <span className="font-medium text-apple-black">{role.title}</span>
                        <span className="text-sm text-apple-gray">{role.skillsNeeded}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {project.admin && (
                <div className="flex items-center gap-3 pt-6 border-t border-apple-border">
                  <img src={project.admin.avatar} alt="" className="w-8 h-8 rounded-full border border-apple-border" />
                  <span className="text-sm text-apple-gray">Led by <span className="text-apple-black font-medium">{project.admin.name}</span></span>
                </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">TESTIMONIALS</span>
          <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em]">Loved by learners.</h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          drag="x"
          dragConstraints={{ left: -800, right: 0 }}
          className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 pb-8 snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((rev, i) => (
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} key={i} className="min-w-[300px] md:min-w-[400px] bg-apple-bg p-8 rounded-[24px] border border-apple-border snap-start flex flex-col justify-between flex-shrink-0">
              <div>
                <div className="flex gap-1 mb-6 text-apple-black">★★★★★</div>
                <p className="text-apple-black text-[17px] mb-8 leading-relaxed">"{rev.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={rev.author.avatar} alt="" className="w-12 h-12 rounded-full border border-apple-border bg-white" />
                <div>
                  <h5 className="font-semibold text-apple-black text-[15px]">{rev.author.name}</h5>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-apple-bg text-center border-t border-apple-border">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-[64px] md:text-[80px] font-bold text-apple-black tracking-[-0.03em] leading-tight mb-6">
            Ready to elevate your skills?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-[19px] text-apple-gray mb-12">
            Join a thriving community learning and building together.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-apple-black text-white rounded-full font-medium hover:bg-[#333333] transition-colors text-[17px]">
              Create Free Account
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-10 pb-10 border-t border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H14V9H7V11.5H13V14.5H7V18H15V21H4V6Z" fill="#1D1D1F"/>
              <path d="M9 3H19V6H12V8.5H18V11.5H12V15H20V18H9V3Z" fill="#AEAEB2"/>
            </svg>
            <span className="text-xl font-semibold text-apple-black tracking-tight">Elevate</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-[14px]">
            <Link to="/" className="text-apple-gray hover:text-apple-black transition-colors">Home</Link>
            <Link to="/browse" className="text-apple-gray hover:text-apple-black transition-colors">Browse</Link>
            <Link to="/projects" className="text-apple-gray hover:text-apple-black transition-colors">Projects</Link>
            <Link to="/login" className="text-apple-gray hover:text-apple-black transition-colors">Sign In</Link>
            <Link to="/register" className="text-apple-gray hover:text-apple-black transition-colors">Register</Link>
          </div>
          <p className="text-[14px] text-apple-gray">© 2026 Elevate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;