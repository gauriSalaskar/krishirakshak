import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import AuroraBackground from '../components/ui/AuroraBackground'
import AINodeNetwork from '../components/ui/AINodeNetwork'
import MagneticCard from '../components/ui/MagneticCard'
import { useScrambleText } from '../hooks/useScrambleText'
import { Microscope, Map, Bell, BookOpen, CloudSun, Users, ArrowRight } from 'lucide-react'

const features = [
  { icon: Microscope, title: 'AI Disease Detection', desc: 'Upload a crop photo and get instant diagnosis using EfficientNetB0 trained on PlantVillage dataset with 38 disease classes.', color: '#F0FDF4', iconColor: '#166534', border: '#BBF7D0' },
  { icon: Map, title: 'Live Disease Heatmap', desc: 'Interactive Leaflet map and 3D globe showing real-time outbreak clusters across India with pulsing risk markers.', color: '#FEF9C3', iconColor: '#854F0B', border: '#FDE68A' },
  { icon: Bell, title: 'Outbreak Alerts', desc: 'Automatic high-risk alerts generated when 10+ same-disease reports appear within 5km radius in 7 days.', color: '#FEF2F2', iconColor: '#991B1B', border: '#FECACA' },
  { icon: CloudSun, title: 'Weather Risk Analysis', desc: 'Open-Meteo weather integration for real-time disease risk prediction per crop season and location.', color: '#EFF6FF', iconColor: '#1E3A8A', border: '#BFDBFE' },
  { icon: Users, title: 'Farmer Community', desc: 'Share crop disease images, post reports and connect with nearby farmers to get real-time community help.', color: '#F5F3FF', iconColor: '#5B21B6', border: '#DDD6FE' },
  { icon: BookOpen, title: 'Kisan Yojana Hub', desc: '15+ real government schemes with AI-powered assistant to find schemes you are eligible for in your language.', color: '#FFF7ED', iconColor: '#C2410C', border: '#FED7AA' },
]

const steps = [
  { n: '01', title: 'Upload Crop Image', desc: 'Farmer takes a photo of a sick crop and uploads it to KrishiRakshak AI from any device.' },
  { n: '02', title: 'AI Analyzes Disease', desc: 'EfficientNetB0 model identifies the disease with confidence score and generates treatment plan.' },
  { n: '03', title: 'Location Recorded', desc: 'GPS coordinates are stored and the disease heatmap updates in real time across India.' },
  { n: '04', title: 'Outbreak Analysis', desc: 'System checks for clusters: 10+ same disease reports within 5km in 7 days triggers alert.' },
  { n: '05', title: 'Alert Generated', desc: 'High-risk alert is created and visible to all farmers in the affected area on their dashboard.' },
]

export default function Landing() {
  const h1 = useScrambleText('Protect Your Crops')
  const h2 = useScrambleText("Before It's Too Late")

  return (
    <div className="min-h-screen" style={{ background: '#FAF9F6' }}>
      <Navbar />

      {/* Hero */}
      <AuroraBackground className="min-h-screen flex items-center justify-center pt-16">
        <AINodeNetwork />
        <div className="relative text-center px-4 max-w-5xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-10"
            style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
            🌱 AI-Powered Crop Intelligence Platform — Built for Indian Farmers
          </motion.div>

          <div className="mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif font-bold leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              <span ref={h1.ref} onMouseEnter={h1.onHover} onMouseLeave={h1.onLeave}
                className="block text-gray-900 cursor-default transition-colors duration-200">
                Protect Your Crops
              </span>
              <span ref={h2.ref} onMouseEnter={h2.onHover} onMouseLeave={h2.onLeave}
                className="block cursor-default transition-colors duration-200" style={{ color: '#166534' }}>
                Before It's Too Late
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-500 text-xl mt-4 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered crop disease detection, real-time outbreak monitoring and smart agricultural intelligence for every Indian farmer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium text-base hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 hover:shadow-xl hover:-translate-y-0.5">
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-medium text-base hover:bg-green-50 transition-all">
              Sign In
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center gap-12 mt-16 flex-wrap">
            {[
              { label: 'Disease Classes', value: '38+' },
              { label: 'Govt Schemes', value: '15+' },
              { label: 'Alert Radius', value: '5km' },
              { label: 'Response Time', value: '<2s' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features */}
      <section id="features" className="py-28 px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
            Platform Features
          </span>
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Everything to Protect Your Farm</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">AI surveillance network from upload to alert in under 2 seconds</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <MagneticCard
                className="bg-white rounded-2xl p-6 border h-full"
                style={{ borderColor: f.border, borderLeftWidth: 3, borderLeftColor: f.iconColor }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color }}>
                  <f.icon size={20} style={{ color: f.iconColor }} />
                </div>
                <h3 className="font-serif font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: f.iconColor }}>
                  Learn more <ArrowRight size={12} />
                </div>
              </MagneticCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="howitworks" className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
              AI Surveillance Network
            </span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">From farm photo to nationwide outbreak alert in minutes</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div key={step.n}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-8 items-start pl-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-base shrink-0 z-10"
                    style={{ background: i === steps.length - 1 ? '#166534' : '#F0FDF4', color: i === steps.length - 1 ? '#fff' : '#166534', border: `2px solid ${i === steps.length - 1 ? '#166534' : '#BBF7D0'}` }}>
                    {step.n}
                  </div>
                  <MagneticCard className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-serif font-semibold text-xl text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-500">{step.desc}</p>
                  </MagneticCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-8 relative overflow-hidden" style={{ background: '#166534' }}>
        <div className="aurora absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(163,230,53,0.3) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Start Protecting Your Crops Today</h2>
            <p className="text-green-200 text-lg mb-10">Free to use. No credit card. Built for every Indian farmer.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-primary transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: '#A3E635' }}>
                Get Started Free →
              </Link>
              <Link to="/login"
                className="px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#A3E635' }}>
                  <span className="text-primary font-bold text-sm">K</span>
                </div>
                <span className="font-serif font-semibold text-white text-lg">KrishiRakshak AI</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">AI-powered crop protection platform for Indian farmers. Detect diseases, monitor outbreaks, access government schemes.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#howitworks' },
                { label: 'Login', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map(l => (
                <a key={l.label} href={l.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500">© 2025 KrishiRakshak AI. Built for National Hackathon.</p>
            <p className="text-sm text-gray-600">Powered by EfficientNetB0 · MongoDB Atlas · FastAPI · React</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
