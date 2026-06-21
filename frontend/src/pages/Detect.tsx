import { useState, useRef, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, AlertTriangle, CheckCircle, Download, Leaf } from 'lucide-react'
import { predictAPI, reportsAPI, weatherAPI } from '../lib/api'
import { compressImage } from '../lib/imageCompress'
import MagneticCard from '../components/ui/MagneticCard'
import { useGeolocation } from '../hooks/useGeolocation'
import { lazy } from 'react'

const LeafScanAnimation = lazy(() => import('../components/detection/LeafScanAnimation'))

interface PredictionResult {
  disease: string
  confidence: number
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

const riskConfig = {
  Low: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  Medium: { bg: '#FEF9C3', text: '#854F0B', border: '#FDE68A' },
  High: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
}

export default function Detect() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [cropName, setCropName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { location } = useGeolocation()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be under 10MB.'); return }
    const compressed = await compressImage(file)
    setImage(compressed); setPreview(URL.createObjectURL(compressed))
    setResult(null); setSaved(false); setError('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleScan = async () => {
    if (!image) return
    setScanning(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', image)
      fd.append('cropName', cropName || '')
      const res = await predictAPI.predict(fd)
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'AI model unavailable. Ensure the backend is running and model.keras is in the ai/ folder.')
    } finally {
      setScanning(false)
    }
  }

  const handleSave = async () => {
    if (!result || !image) return
    setSaving(true)
    try {
      let weatherData = { temperature: 28, humidity: 65, windSpeed: 12, condition: 'Clear' }
      try {
        const wRes = await weatherAPI.get(location.lat, location.lon)
        weatherData = wRes.data
      } catch {}

      const fd = new FormData()
      fd.append('file', image)
      fd.append('cropName', cropName || 'Unknown')
      fd.append('diseaseName', result.disease)
      fd.append('confidence', String(result.confidence))
      fd.append('symptoms', JSON.stringify(result.symptoms))
      fd.append('treatment', JSON.stringify(result.treatment))
      fd.append('prevention', JSON.stringify(result.prevention))
      fd.append('riskLevel', result.riskLevel)
      fd.append('latitude', String(location.lat))
      fd.append('longitude', String(location.lon))
      fd.append('weather', JSON.stringify(weatherData))
      await reportsAPI.create(fd)
      setSaved(true)
    } catch {
      setError('Failed to save report. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Crop Disease Detection</h1>
        <p className="text-gray-500 mt-1">Upload a crop image for instant AI diagnosis · Location: {location.city}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Panel */}
        <div className="space-y-4">
          <MagneticCard className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-lg text-gray-900 mb-4">Upload Image</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select value={cropName} onChange={e => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50">
                <option value="">Select crop type...</option>
                {['Tomato','Potato','Corn','Wheat','Rice','Cotton','Soybean','Sugarcane','Pepper','Apple','Grape','Mango','Groundnut','Onion','Garlic'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all"
              style={{ borderColor: dragOver ? '#22C55E' : '#BBF7D0', background: dragOver ? '#F0FDF4' : '#F8FAFC', cursor: 'pointer' }}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="max-h-52 mx-auto rounded-xl object-cover shadow-md" />
                  <button onClick={e => { e.stopPropagation(); setImage(null); setPreview(null); setResult(null) }}
                    className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <p className="font-medium text-gray-700 mb-1">Drag & Drop your crop image</p>
                  <p className="text-sm text-gray-400 mb-3">or click to browse files</p>
                  <span className="inline-block px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">Browse File</span>
                  <p className="text-xs text-gray-300 mt-3">JPG, PNG, WEBP up to 10MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {error && <p className="text-red-500 text-sm mt-2 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button onClick={handleScan} disabled={!image || scanning}
              className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
              {scanning ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scanning with AI...</>
              ) : (
                <><Leaf size={18} /> Scan for Disease</>
              )}
            </button>
          </MagneticCard>

          {/* How it works */}
          <MagneticCard className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-serif font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { n: 1, t: 'Upload', d: 'Take or choose a clear photo of the affected leaf or plant part' },
                { n: 2, t: 'AI Scan', d: 'EfficientNetB0 model analyzes patterns across 38 disease classes' },
                { n: 3, t: 'Get Results', d: 'Disease name, confidence %, symptoms and treatment plan' },
                { n: 4, t: 'Save & Alert', d: 'Report stored, heatmap updated, outbreak analysis runs' },
              ].map((s, i) => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: i === 3 ? '#166534' : '#F0FDF4', color: i === 3 ? '#fff' : '#166534' }}>
                    {s.n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.t}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </MagneticCard>
        </div>

        {/* Result Panel */}
        <div>
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Suspense fallback={
                  <div className="h-56 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  <LeafScanAnimation />
                </Suspense>
                <div className="p-6 text-center">
                  <p className="font-serif text-xl font-semibold text-gray-900 mb-2">Analyzing your crop...</p>
                  <p className="text-gray-400 text-sm">EfficientNetB0 is processing the image and detecting disease patterns across 38 classes</p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-secondary"
                        style={{ animation: `bounce 1s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">

                {/* Disease header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Detected Disease</p>
                    <h2 className="font-serif text-2xl font-bold text-gray-900">
                      {result.isUncertain ? `Possible: ${result.disease}` : result.disease}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">📍 {location.city}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={result.isUncertain
                      ? { background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }
                      : { background: riskConfig[result.riskLevel].bg, color: riskConfig[result.riskLevel].text, border: `1px solid ${riskConfig[result.riskLevel].border}` }}>
                    {result.isUncertain ? 'Uncertain' : `${result.riskLevel} Risk`}
                  </span>
                </div>

                {/* Confidence meter */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">Confidence Score</span>
                    <span className="font-bold text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #166534, #22C55E, #A3E635)' }} />
                  </div>
                </div>

                {/* Uncertainty warning */}
                {result.isUncertain && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                      Low confidence result — try a clearer, well-lit photo of just the affected leaf for a more reliable diagnosis.
                    </p>
                  </div>
                )}

                {/* Top alternative predictions */}
                {result.topPredictions && result.topPredictions.length > 1 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Other Possibilities</h3>
                    <div className="space-y-1.5">
                      {result.topPredictions.slice(1).map((p: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-600">{p.disease}</span>
                          <span className="text-gray-400 font-medium">{(p.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-yellow-500" /> Symptoms
                  </h3>
                  <ul className="space-y-1.5">
                    {result.symptoms.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 mt-1.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment */}
                <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <h3 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                    <CheckCircle size={15} /> Recommended Treatment
                  </h3>
                  <ul className="space-y-1.5">
                    {result.treatment.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                        <span className="text-secondary font-bold shrink-0">→</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Prevention Tips</h3>
                  <ul className="space-y-1.5">
                    {result.prevention.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-accent font-bold shrink-0">✦</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving || saved}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg"
                    style={{ background: saved ? '#22C55E' : '#166534', boxShadow: saved ? '0 4px 12px rgba(34,197,94,0.3)' : '0 4px 12px rgba(22,101,52,0.2)' }}>
                    {saved ? '✓ Report Saved!' : saving ? 'Saving...' : '💾 Save Report'}
                  </button>
                  <button onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-primary text-primary hover:bg-green-50 transition-colors flex items-center justify-center gap-1.5">
                    <Download size={15} /> Download
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[460px] text-center">
                <div className="w-24 h-24 rounded-3xl bg-green-50 border-2 border-green-100 flex items-center justify-center mb-5">
                  <Leaf size={40} className="text-primary opacity-30" />
                </div>
                <p className="font-serif text-xl font-semibold text-gray-400 mb-2">Awaiting Image</p>
                <p className="text-gray-300 text-sm max-w-xs">Upload a crop image on the left and click Scan to get instant AI diagnosis with treatment recommendations</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}