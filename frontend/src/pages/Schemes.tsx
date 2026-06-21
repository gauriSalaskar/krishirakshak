import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { schemesAPI } from '../lib/api'
import { Scheme } from '../types'
import { Search, Bookmark, ExternalLink, ChevronDown, ChevronUp, Bot, Send, X, Sparkles } from 'lucide-react'
import EligibilityChecker from '../components/schemes/EligibilityChecker'
import { t, Lang } from '../lib/translations'

const CATEGORIES = ['All', 'Insurance', 'Subsidy', 'Credit', 'Irrigation', 'Technology', 'Organic', 'Marketing']
const STATES = ['All States', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'West Bengal', 'Bihar', 'Odisha']

export default function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [state, setState] = useState('All States')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [checkerOpen, setCheckerOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: t('en', 'chatWelcome') }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params: any = {}
    if (category !== 'All') params.category = category
    if (state !== 'All States') params.state = state
    if (search) params.search = search
    schemesAPI.getAll(params)
      .then(r => { setSchemes(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, state, search])

  // Load already-saved scheme IDs once on mount so the bookmark icon
  // correctly shows "filled" state after a page reload
  useEffect(() => {
    schemesAPI.getSaved()
      .then(r => setSaved(new Set(r.data.map((s: any) => s.schemeId))))
      .catch(() => {})
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update the assistant's welcome message when language changes,
  // but only if the conversation hasn't started yet
  useEffect(() => {
    setMessages(prev => prev.length === 1 ? [{ role: 'assistant', content: t(lang, 'chatWelcome') }] : prev)
  }, [lang])

  const handleSave = async (schemeId: string) => {
    try {
      await schemesAPI.save(schemeId)
      setSaved(prev => new Set([...prev, schemeId]))
    } catch {}
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = { role: 'user', content: chatInput }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await schemesAPI.askAI(chatInput, messages, lang)
      setMessages([...newMsgs, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Sorry, I could not connect to the AI assistant. Please try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  const langLabels = { en: 'English', hi: 'हिंदी', mr: 'मराठी' }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl font-bold text-gray-900">{t(lang, 'pageTitle')}</h1>
            {/* Ashoka chakra watermark */}
            <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-20">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#F97316" strokeWidth="2"/>
              <circle cx="16" cy="16" r="5" fill="none" stroke="#F97316" strokeWidth="1.5"/>
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180
                const x1 = 16 + 5 * Math.cos(angle), y1 = 16 + 5 * Math.sin(angle)
                const x2 = 16 + 13 * Math.cos(angle), y2 = 16 + 13 * Math.sin(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F97316" strokeWidth="0.8" />
              })}
            </svg>
          </div>
          <p className="text-gray-500">{t(lang, 'pageSubtitle')}</p>
        </div>
        {/* Language toggle */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
          {(['en', 'hi', 'mr'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${lang === l ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              style={{ background: lang === l ? '#F97316' : 'transparent' }}>
              {langLabels[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Eligibility Checker CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1px solid #FED7AA' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Sparkles size={18} style={{ color: '#F97316' }} />
          </div>
          <div>
            <p className="font-serif font-semibold text-gray-900">{t(lang, 'eligibilityCTA')}</p>
            <p className="text-sm text-gray-500">{t(lang, 'eligibilityDesc')}</p>
          </div>
        </div>
        <button onClick={() => setCheckerOpen(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
          style={{ background: '#F97316' }}>
          {t(lang, 'checkEligibility')}
        </button>
      </motion.div>

      {/* Search & filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t(lang, 'searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm bg-white"
            style={{ '--tw-ring-color': '#F97316' } as any} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                category === c ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'}`}
              style={{ background: category === c ? '#F97316' : undefined }}>
              {c}
            </button>
          ))}

          <select value={state} onChange={e => setState(e.target.value)}
            className="ml-auto px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2">
            {STATES.map(s => <option key={s} value={s}>{s === 'All States' ? t(lang, 'allStates') : s}</option>)}
          </select>
        </div>
      </div>

      <EligibilityChecker open={checkerOpen} onClose={() => setCheckerOpen(false)} onSave={handleSave} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F97316', borderTopColor: 'transparent' }} />
        </div>
      ) : schemes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
          <p className="font-serif text-xl font-semibold text-gray-400 mb-2">{t(lang, 'noSchemesFound')}</p>
          <p className="text-gray-300 text-sm">{t(lang, 'tryDifferentSearch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, i) => (
            <motion.div key={scheme._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              style={{
                borderLeft: '3px solid transparent',
                borderImage: 'linear-gradient(to bottom, #F97316 33%, #ffffff 33% 66%, #166534 66%) 1',
              }}>
              <div className="p-5">
                {/* Ministry badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
                    {scheme.ministry}
                  </span>
                  <button onClick={() => handleSave(scheme._id)}
                    className={`p-1.5 rounded-lg transition-colors ${saved.has(scheme._id) ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'}`}>
                    <Bookmark size={16} fill={saved.has(scheme._id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Scheme name */}
                <h3 className="font-serif font-bold text-gray-900 text-base mb-2 leading-snug">{scheme.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{scheme.description}</p>

                {/* Key benefit */}
                <div className="rounded-lg p-2.5 mb-4 text-sm font-medium"
                  style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
                  ✦ {scheme.benefits[0]}
                </div>

                {/* Eligibility summary */}
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  <span className="font-medium text-gray-600">{t(lang, 'eligibility')}: </span>
                  {scheme.eligibility[0]}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                    style={{ background: '#F97316' }}>
                    <ExternalLink size={14} /> {t(lang, 'applyNow')}
                  </a>
                  <button onClick={() => setExpanded(expanded === scheme._id ? null : scheme._id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors">
                    {expanded === scheme._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === scheme._id ? t(lang, 'less') : t(lang, 'more')}
                  </button>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === scheme._id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{t(lang, 'allBenefits')}</p>
                          <ul className="space-y-1">{scheme.benefits.map((b, bi) => (
                            <li key={bi} className="text-xs text-gray-600 flex gap-1.5"><span className="text-orange-400">•</span>{b}</li>
                          ))}</ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{t(lang, 'requiredDocs')}</p>
                          <ul className="space-y-1">{scheme.requiredDocuments.map((d, di) => (
                            <li key={di} className="text-xs text-gray-600 flex gap-1.5"><span className="text-orange-400">•</span>{d}</li>
                          ))}</ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{t(lang, 'howToApply')}</p>
                          <ol className="space-y-1">{scheme.howToApply.map((s, si) => (
                            <li key={si} className="text-xs text-gray-600 flex gap-1.5"><span className="text-orange-600 font-bold">{si + 1}.</span>{s}</li>
                          ))}</ol>
                        </div>
                        {scheme.helplineNumber && (
                          <p className="text-xs text-gray-500">📞 {t(lang, 'helpline')}: <span className="font-medium text-gray-700">{scheme.helplineNumber}</span></p>
                        )}
                        {/* Share & Print */}
                        <div className="flex gap-2 pt-2">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`🌱 ${scheme.name}\n\n${scheme.description}\n\nApply here: ${scheme.officialLink}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-600 transition-colors">
                            💬 {t(lang, 'shareWhatsapp')}
                          </a>
                          <button
                            onClick={() => {
                              const w = window.open('', '_blank')
                              if (!w) return
                              w.document.write(`
                                <html><head><title>${scheme.name}</title>
                                <style>body{font-family:sans-serif;padding:40px;color:#1F2937;max-width:700px;margin:0 auto}
                                h1{color:#166534;font-size:22px}h2{color:#F97316;font-size:14px;margin-top:24px}
                                p,li{font-size:13px;line-height:1.6;color:#374151}.tag{background:#FFF7ED;color:#C2410C;padding:4px 10px;border-radius:6px;font-size:12px;display:inline-block;margin-bottom:12px}</style>
                                </head><body>
                                <span class="tag">${scheme.ministry}</span>
                                <h1>${scheme.name}</h1>
                                <p>${scheme.description}</p>
                                <h2>BENEFITS</h2><ul>${scheme.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
                                <h2>ELIGIBILITY</h2><ul>${scheme.eligibility.map(e => `<li>${e}</li>`).join('')}</ul>
                                <h2>REQUIRED DOCUMENTS</h2><ul>${scheme.requiredDocuments.map(d => `<li>${d}</li>`).join('')}</ul>
                                <h2>HOW TO APPLY</h2><ol>${scheme.howToApply.map(s => `<li>${s}</li>`).join('')}</ol>
                                <p style="margin-top:24px"><strong>Official Link:</strong> ${scheme.officialLink}<br/>
                                ${scheme.helplineNumber ? `<strong>Helpline:</strong> ${scheme.helplineNumber}` : ''}</p>
                                </body></html>
                              `)
                              w.document.close()
                              w.print()
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors">
                            🖨️ {t(lang, 'printSummary')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Chat Widget */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: '#F97316' }}>
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-white" />
                  <span className="text-white font-medium text-sm">{t(lang, 'schemeAssistant')}</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      m.role === 'user' ? 'text-white' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}
                      style={{ background: m.role === 'user' ? '#F97316' : undefined }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                            style={{ animation: `bounce 1s infinite ${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder={t(lang, 'chatPlaceholder')}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-sm bg-gray-50" />
                <button onClick={handleChat} disabled={chatLoading || !chatInput.trim()}
                  className="w-9 h-9 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
                  style={{ background: '#F97316' }}>
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setChatOpen(!chatOpen)}
          aria-label={t(lang, 'askAboutSchemes')}
          title={t(lang, 'askAboutSchemes')}
          className="w-14 h-14 text-white rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: '#F97316' }}>
          {chatOpen ? <X size={24} /> : <Bot size={24} />}
        </button>
      </div>
    </div>
  )
}
