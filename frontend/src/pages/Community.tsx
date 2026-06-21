import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { communityAPI } from '../lib/api'
import { CommunityPost } from '../types'
import { useAuthStore } from '../lib/store'
import { Heart, MessageCircle, MapPin, Upload, X, Send } from 'lucide-react'
import MagneticCard from '../components/ui/MagneticCard'
import { compressImage } from '../lib/imageCompress'

export default function Community() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [diseaseTag, setDiseaseTag] = useState('')
  const [posting, setPosting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    communityAPI.getPosts()
      .then(r => { setPosts(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handlePost = async () => {
    if (!content.trim()) return
    setPosting(true)
    try {
      const fd = new FormData()
      fd.append('content', content)
      if (image) fd.append('file', image)
      if (diseaseTag) fd.append('diseaseTag', diseaseTag)
      const res = await communityAPI.createPost(fd)
      setPosts([res.data, ...posts])
      setContent(''); setImage(null); setPreview(null); setDiseaseTag(''); setShowForm(false)
    } catch {
      alert('Failed to post. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (id: string) => {
    try {
      const res = await communityAPI.likePost(id)
      const liked = res.data.liked
      setPosts(posts.map(p => {
        if (p._id !== id) return p
        const likedBy = new Set(p.likedBy || [])
        if (liked) likedBy.add(user?.id || '')
        else likedBy.delete(user?.id || '')
        return { ...p, likes: p.likes + (liked ? 1 : -1), likedBy: Array.from(likedBy) }
      }))
    } catch {}
  }

  const handleComment = async (id: string) => {
    const text = commentInputs[id]
    if (!text?.trim()) return
    try {
      await communityAPI.addComment(id, text)
      setPosts(posts.map(p => p._id === id ? {
        ...p, comments: [...p.comments, { userId: user?.id || '', userName: user?.name || '', content: text, createdAt: new Date().toISOString() }]
      } : p))
      setCommentInputs({ ...commentInputs, [id]: '' })
    } catch {}
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Farmer Community</h1>
          <p className="text-gray-500 mt-1">Share crop issues and help fellow farmers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
          + Create Post
        </button>
      </div>

      {/* Create post form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-serif font-semibold text-gray-900 mb-4">Share with the Community</h2>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={3}
              placeholder="Describe your crop issue, disease spotted, or farming tip..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50 resize-none mb-3" />

            <div className="flex gap-3 mb-3">
              <input value={diseaseTag} onChange={e => setDiseaseTag(e.target.value)} placeholder="Disease tag (optional)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50" />
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
                <Upload size={16} /> Image
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={async e => {
                  const f = e.target.files?.[0]
                  if (f) {
                    const compressed = await compressImage(f)
                    setImage(compressed); setPreview(URL.createObjectURL(compressed))
                  }
                }} />
            </div>

            {preview && (
              <div className="relative w-fit mb-3">
                <img src={preview} alt="preview" className="h-24 rounded-lg object-cover" />
                <button onClick={() => { setImage(null); setPreview(null) }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handlePost} disabled={posting || !content.trim()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                {posting ? 'Posting...' : 'Post'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
          <svg width="80" height="80" viewBox="0 0 80 80" className="mb-4 opacity-40">
            <circle cx="40" cy="40" r="35" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2"/>
            <circle cx="30" cy="35" r="5" fill="#22C55E" opacity="0.6"/>
            <circle cx="50" cy="35" r="5" fill="#22C55E" opacity="0.6"/>
            <path d="M25 52 Q40 62 55 52" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <p className="font-serif text-xl font-semibold text-gray-400 mb-2">No posts yet</p>
          <p className="text-gray-300 text-sm">Be the first to share something with the community</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <MagneticCard className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" maxDeg={5}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                    {post.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{post.userName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin size={11} /> {post.location}
                      <span>·</span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {post.diseaseTag && (
                    <span className="ml-auto px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                      🦠 {post.diseaseTag}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.content}</p>

                {post.imageUrl && (
                  <img src={post.imageUrl} alt="post" className="w-full rounded-xl object-cover max-h-64 mb-4 border border-gray-100" />
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                  <button onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      (post.likedBy || []).includes(user?.id || '') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                    <Heart size={16} fill={(post.likedBy || []).includes(user?.id || '') ? 'currentColor' : 'none'} /> {post.likes}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <MessageCircle size={16} /> {post.comments.length}
                  </span>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {post.comments.slice(-3).map((c, ci) => (
                      <div key={ci} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                          {c.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                          <span className="text-xs font-medium text-gray-700">{c.userName} </span>
                          <span className="text-xs text-gray-500">{c.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </MagneticCard>

              {/* Comment input — kept outside MagneticCard so typing doesn't trigger tilt */}
              <div className="flex gap-2 mt-3 bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
                <input value={commentInputs[post._id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary text-sm bg-gray-50" />
                <button onClick={() => handleComment(post._id)}
                  className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors">
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}