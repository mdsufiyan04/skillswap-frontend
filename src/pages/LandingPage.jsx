import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { stats, categories, users, reviews } from '../data/dummyData';

const CountUp = ({ end, float = false }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(float ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, started, float]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {float ? count.toFixed(1) : count}
    </motion.span>
  );
};

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
      {/* Landing Navbar */}
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
            <a href="#how-it-works" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">Product</a>
            <a href="#how-it-works" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">How it Works</a>
            <a href="#community" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">Community</a>
            <a href="#pricing" className="text-sm font-medium text-apple-gray hover:text-apple-black transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-apple-black transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-medium bg-apple-black text-white px-6 py-3 rounded-full hover:bg-[#333333] transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
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
            Teach what you know. Learn what you don't. Connect with people who make you better.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-apple-black text-white rounded-full font-medium hover:bg-[#333333] transition-colors">
              Start for free →
            </button>
            <button onClick={() => navigate('/browse')} className="px-6 py-3 bg-transparent text-apple-black border border-apple-black rounded-full font-medium hover:bg-apple-bg transition-colors">
              See how it works
            </button>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-apple-gray mt-6">
            Joined by 2847+ learners
          </motion.p>
        </motion.div>

        {/* Floating Cards */}
        <div className="w-full max-w-5xl mx-auto mt-20 relative h-[200px] hidden md:block">
          {[
            { delay: 0, rotate: -3, x: -300, y: 0 },
            { delay: 1, rotate: 0, x: 0, y: -20 },
            { delay: 2, rotate: 3, x: 300, y: 10 }
          ].map((style, idx) => (
            <motion.div
              key={idx}
              initial={{ y: style.y, x: style.x, rotate: style.rotate }}
              animate={{ y: [style.y, style.y - 15, style.y] }}
              transition={{ repeat: Infinity, duration: 4, delay: style.delay, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -ml-[150px] w-[300px] bg-white border border-apple-border rounded-[18px] p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-apple-bg"></div>
                <span className="text-apple-gray">↔</span>
                <div className="w-10 h-10 rounded-full bg-apple-bg"></div>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>React</span>
                <span className="text-apple-black font-bold">98%</span>
                <span>UI Design</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-apple-bg py-20 border-y border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-apple-border">
            {[
              { num: 2847, label: "Learners", suffix: "+" },
              { num: 12490, label: "Exchanges", suffix: "+" },
              { num: 4.9, label: "Rating", suffix: "★", float: true },
              { num: 28, label: "Countries", suffix: "" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeUp} className="flex-1 text-center py-8 md:py-0">
                <div className="text-[48px] font-bold text-apple-black mb-2 flex justify-center items-baseline">
                  {stat.float ? <CountUp end={stat.num} float /> : <CountUp end={stat.num} />}
                  <span className="text-3xl ml-1">{stat.suffix}</span>
                </div>
                <div className="text-[14px] text-apple-gray font-medium uppercase tracking-[0.08em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
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
                { num: "01", title: "Create your profile", desc: "List the skills you have and the ones you want to learn." },
                { num: "02", title: "Find your match", desc: "Our algorithm connects you with people whose skills perfectly complement yours." },
                { num: "03", title: "Exchange and grow", desc: "Start swapping skills, tracking progress, and elevating your career." }
              ].map((step, idx) => (
                <motion.div key={idx} variants={fadeUp} className="relative pt-8 md:pt-16">
                  <div className="absolute top-0 md:-top-4 left-0 text-[120px] font-bold text-apple-bgdark leading-none -z-10">{step.num}</div>
                  <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-4">{step.title}</h3>
                  <p className="text-[17px] text-apple-gray leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="browse" className="py-32 bg-apple-bg overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">EXPLORE</span>
          <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em]">Every skill, one platform.</h2>
        </motion.div>
        
        <div className="relative flex overflow-x-hidden group pb-8">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-4 py-4">
            {[...categories, ...categories, ...categories].map((cat, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-apple-border rounded-full text-apple-black font-medium hover:border-apple-black transition-colors cursor-pointer">
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee2 whitespace-nowrap flex items-center gap-4 py-4" style={{ animationDirection: 'reverse' }}>
            {[...categories, ...categories, ...categories].reverse().map((cat, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-apple-border rounded-full text-apple-black font-medium hover:border-apple-black transition-colors cursor-pointer">
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee 40s linear infinite;
        }
      `}} />

      {/* Feature Highlight */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex-1">
            <h2 className="text-[48px] font-semibold text-apple-black tracking-[-0.02em] leading-tight mb-6">Meet your perfect match.</h2>
            <p className="text-[19px] text-apple-gray mb-10 leading-relaxed">
              Powered by advanced AI matching. We don't just look at skills, we look at learning styles, availability, and goals to find your ideal exchange partner.
            </p>
            <ul className="space-y-6">
              {['Complementary skill pairing', 'Learning style alignment', 'Automated schedule syncing'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-apple-black text-[17px]">
                  <div className="w-6 h-6 rounded-full bg-apple-black text-white flex items-center justify-center text-xs font-bold">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-apple-bg rounded-[24px] scale-105 -z-10"></div>
            <div className="bg-white p-8 rounded-[18px] border border-apple-border relative animate-pulse-glow">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-apple-bg border border-apple-border overflow-hidden">
                    <img src={users[0].avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-apple-black text-[19px]">{users[0].name}</h4>
                    <p className="text-apple-gray text-[14px]">{users[0].college}</p>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-apple-black flex items-center justify-center text-apple-black font-bold text-[19px]">
                  96%
                </div>
              </div>
              <p className="text-apple-gray text-[14px] mb-8 leading-relaxed">
                "Offers React which you want to learn, and wants to learn UI Design which you offer. High availability alignment."
              </p>
              <button className="w-full py-3 bg-apple-black text-white rounded-full font-medium hover:bg-[#333333] transition-colors">
                Connect
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0%, 100% { border-color: #D2D2D7; }
          50% { border-color: #1D1D1F; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s infinite ease-in-out;
        }
      `}} />

      {/* Social Proof */}
      <section id="community" className="py-32 bg-apple-bg overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <span className="text-[12px] font-medium text-apple-gray tracking-[0.08em] uppercase block mb-4">WHAT PEOPLE SAY</span>
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
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} key={i} className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-[18px] border border-apple-border snap-start flex flex-col justify-between flex-shrink-0">
              <div>
                <div className="flex gap-1 mb-6 text-apple-black">★★★★★</div>
                <p className="text-apple-black text-[17px] mb-8 leading-relaxed">"{rev.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={rev.author.avatar} alt="" className="w-12 h-12 rounded-full border border-apple-border" />
                <div>
                  <h5 className="font-semibold text-apple-black text-[14px]">{rev.author.name}</h5>
                  <p className="text-[14px] text-apple-gray">{rev.author.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-[80px] font-bold text-apple-black tracking-[-0.03em] leading-tight mb-6">
            Ready to elevate?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-[19px] text-apple-gray mb-12">
            Join thousands of others learning and teaching for free.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-apple-black text-white rounded-full font-medium hover:bg-[#333333] transition-colors text-[17px]">
              Join Elevate Free →
            </button>
            <p className="text-[14px] text-apple-gray mt-6">No credit card required. Free forever.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-apple-bg border-t border-apple-border pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H14V9H7V11.5H13V14.5H7V18H15V21H4V6Z" fill="#1D1D1F"/>
                  <path d="M9 3H19V6H12V8.5H18V11.5H12V15H20V18H9V3Z" fill="#AEAEB2"/>
                </svg>
                <span className="text-xl font-semibold text-apple-black tracking-tight">Elevate</span>
              </Link>
              <p className="text-[14px] text-apple-gray max-w-[250px]">
                The skills economy, reimagined. Teach what you know, learn what you don't.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-apple-black text-[12px] tracking-[0.08em] uppercase mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Features</a></li>
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">How it works</a></li>
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-black text-[12px] tracking-[0.08em] uppercase mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">About</a></li>
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Blog</a></li>
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-apple-black text-[12px] tracking-[0.08em] uppercase mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Privacy</a></li>
                <li><a href="#" className="text-[14px] text-apple-gray hover:text-apple-black transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-apple-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-apple-gray">© 2026 Elevate. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-apple-gray hover:text-apple-black transition-colors">Twitter</a>
              <a href="#" className="text-apple-gray hover:text-apple-black transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;