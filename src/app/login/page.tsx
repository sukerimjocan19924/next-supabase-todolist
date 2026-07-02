'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleKakaoLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'profile_nickname profile_image',
            },
        })
    }
    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) {
                setError(error.message)
            } else {
                router.push('/')
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError(error.message)
            } else {
                router.push('/')
                router.refresh()
            }
        }
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
                <h1 className="text-xl font-semibold text-gray-800 mb-6">
                    {isSignUp ? '회원가입' : '로그인'}
                </h1>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        placeholder='이메일'
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        placeholder='비밀번호'
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
                    </button>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">또는</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <button
                        onClick={handleKakaoLogin}

                        className="mt-4 w-full py-2 bg-[#FEE500] text-[#3C1E1E] rounded-lg font-medium hover:bg-[#f0d800] transition-colors flex items-center justify-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.376c0 2.085 1.388 3.916 3.476 4.963l-.883 3.298a.188.188 0 0 0 .289.202L8.36 13.52A8.87 8.87 0 0 0 9 13.25c4.142 0 7.5-2.634 7.5-5.874C16.5 4.134 13.142 1.5 9 1.5z" fill="#3C1E1E" />
                        </svg>
                        카카오로 로그인
                    </button>
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                        className="mt-3 text-sm text-gray-500 hover:text-gray-700 w-full text-center"
                    >
                        {isSignUp ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
                    </button>
                </form>
            </div>
        </main>
    )
}
