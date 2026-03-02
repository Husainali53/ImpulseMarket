'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EmailSignup() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const { error } = await supabase.from('waitlist').insert({ email })
            if (error) throw error
            setStatus('success')
            setMessage('Thanks! Check your email daily for AI market updates.')
            setEmail('')
        } catch (error) {
            setStatus('error')
            setMessage('Already subscribed or error occurred.')
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Get AI Market Intelligence Daily</h3>
            <p className="text-blue-100 mb-6">Join investors receiving AI-curated stock picks and news.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-4 py-3 rounded-lg text-slate-900" />
                <button type="submit" disabled={status === 'loading'} className="bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-lg font-medium disabled:opacity-50">{status === 'loading' ? 'Joining...' : 'Get Free Access'}</button>
            </form>
            {status !== 'idle' && <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-200' : 'text-red-200'}`}>{message}</p>}
        </div>
    )
}