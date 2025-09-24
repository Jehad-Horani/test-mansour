"use client"

import { useUserContext } from '@/contexts/user-context'
import { useState } from 'react'

export function AuthDebug() {
  const { user, session, loading, error, isLoggedIn, refreshUser, clearError } = useUserContext()
  const [isExpanded, setIsExpanded] = useState(false)

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-3 py-2 rounded text-white text-sm font-mono ${
          loading ? 'bg-yellow-500' : 
          error ? 'bg-red-500' : 
          isLoggedIn ? 'bg-green-500' : 'bg-gray-500'
        }`}
      >
        AUTH: {loading ? 'LOADING' : error ? 'ERROR' : isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}
      </button>
      
      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-80 max-h-96 overflow-auto bg-black text-green-400 p-4 rounded border font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">AUTH DEBUG</span>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <strong>State:</strong>
              <div className="ml-2">
                <div>Loading: {loading ? 'TRUE' : 'FALSE'}</div>
                <div>Logged In: {isLoggedIn ? 'TRUE' : 'FALSE'}</div>
                <div>Error: {error || 'NONE'}</div>
              </div>
            </div>

            <div>
              <strong>Session:</strong>
              <div className="ml-2">
                {session ? (
                  <div>
                    <div>ID: {session.user?.id?.substring(0, 8)}...</div>
                    <div>Email: {session.user?.email}</div>
                    <div>Expires: {session.expires_at ? new Date(session.expires_at * 1000).toLocaleTimeString() : 'Unknown'}</div>
                  </div>
                ) : (
                  <div>NULL</div>
                )}
              </div>
            </div>

            <div>
              <strong>User Profile:</strong>
              <div className="ml-2">
                {user ? (
                  <div>
                    <div>Name: {user.name}</div>
                    <div>Role: {user.role}</div>
                    <div>Major: {user.major}</div>
                    <div>University: {user.university}</div>
                  </div>
                ) : (
                  <div>NULL</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={refreshUser}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Refresh
              </button>
              {error && (
                <button
                  onClick={clearError}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Clear Error
                </button>
              )}
              <button
                onClick={() => {
                  console.log('AUTH DEBUG STATE:', {
                    user,
                    session,
                    loading,
                    error,
                    isLoggedIn,
                    timestamp: new Date().toISOString()
                  })
                }}
                className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Log State
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}