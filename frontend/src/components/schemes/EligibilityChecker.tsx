import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { schemesAPI } from '../../lib/api'
import { Scheme } from '../../types'
import { Sparkles, X, ExternalLink, Bookmark } from 'lucide-react'

const STATES = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'West Bengal', 'Bihar', 'Odisha']
const CROPS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Other']

interface Props {
  open: boolean
  onClose: () => void
  onSave?: (schemeId: string) => void
}

export default function EligibilityChecker({ open, onClose, onSave }: Props) {
  const [landSize, setLandSize] = useState('')
  const [state, setState] = useState('')
  const [cropType, setCropType] = useState('')
  const [income, setIncome] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Scheme[] | null>(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    if (!landSize || !state || !cropType || !income) {
      setError('Please fill in all fields'); return
    }
    setError(''); setLoading(true)
    try {
      const res = await schemesAPI.checkEligibility({
        landSize: parseFloat(landSize), state, cropType, income: parseFloat(income)
      })
      setResults(res.data)
    } catch {
      setError('Could not check eligibility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResults(null); setLandSize(''); setState(''); setCropType(''); setIncome(''); setError('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFF7ED' }}>
                  <Sparkles size={18} style={{ color: '#F97316' }} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-gray-900">Eligibility Checker</h2>
                  <p className="text-xs text-gray-400">Find schemes you qualify for</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {!results ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Size (in acres)</label>
                    <input type="number" value={landSize} onChange={e => setLandSize(e.target.value)}
                      placeholder="e.g. 2.5" min="0" step="0.1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm bg-gray-50"
                      style={{ '--tw-ring-color': '#F97316' } as any} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                      <select value={state} onChange={e => setState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm bg-gray-50">
                        <option value="">Select state...</option>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Crop</label>
                      <select value={cropType} onChange={e => setCropType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm bg-gray-50">
                        <option value="">Select crop...</option>
                        {CROPS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Household Income (₹)</label>
                    <input type="number" value={income} onChange={e => setIncome(e.target.value)}
                      placeholder="e.g. 150000" min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm bg-gray-50" />
                  </div>

                  {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                  <button onClick={handleCheck} disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: '#F97316' }}>
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Checking...</>
                    ) : (
                      <><Sparkles size={18} /> Check My Eligibility</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Found <span className="font-bold text-gray-900">{results.length}</span> matching schemes for your profile
                    </p>
                    <button onClick={reset} className="text-sm font-medium" style={{ color: '#F97316' }}>
                      ← Check again
                    </button>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p className="font-serif text-lg">No matching schemes found</p>
                      <p className="text-sm mt-1">Try adjusting your inputs or browse all schemes</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {results.map((scheme, i) => (
                        <motion.div key={scheme._id}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-serif font-semibold text-gray-900 text-sm">{scheme.name}</h3>
                            <button onClick={() => onSave?.(scheme._id)} className="text-gray-300 hover:text-orange-500 shrink-0 ml-2">
                              <Bookmark size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{scheme.description}</p>
                          <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: '#F97316' }}>
                            Apply Now <ExternalLink size={12} />
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
