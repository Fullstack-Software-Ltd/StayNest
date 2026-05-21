'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User, Loader2, Search, ArrowRight, MessageSquare } from 'lucide-react'
import { CompactPropertyCard } from './CompactPropertyCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useSession } from 'next-auth/react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  properties?: any[]
}

export function UrugoAssistant() {
  const { data: session } = useSession()
  const userName = session?.user?.name
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Welcome to UrugoStay. I am the Platform Manager. How can I assist you with finding your perfect luxury stay or managing your hosting experience in Rwanda today?" 
    }
  ])
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

  const getGreeting = (name?: string | null) => {
    if (name) {
      return `Hi ${name}, welcome to UrugoStay. I am the Platform Manager. How can I assist you with finding your perfect luxury stay or managing your hosting experience in Rwanda today?`
    }
    return "Welcome to UrugoStay. I am the Platform Manager. How can I assist you with finding your perfect luxury stay or managing your hosting experience in Rwanda today?"
  }

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [
          {
            role: 'assistant',
            content: getGreeting(userName)
          }
        ]
      }
      return prev
    })
  }, [userName])
  
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }, (err) => {
        console.warn("Geolocation denied", err)
      })
    }
  }, [])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-urugo-assistant', handleOpen);
    return () => window.removeEventListener('open-urugo-assistant', handleOpen);
  }, [])

const ERROR_FALLBACK_MSG = "I apologize, I'm having a little trouble connecting to my knowledge base. Please try again in a moment."

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Filter out the initial greeting if it's the only thing there, or ensure we only send User/Assistant pairs
      // Also filter out fallback error messages and empty/undefined contents to prevent poisoning history
      const apiMessages = messages.concat(userMessage)
        .filter(m => m.role !== 'system' && m.content && m.content !== ERROR_FALLBACK_MSG)
        .map(m => ({ role: m.role, content: m.content }))

      // If the first message is 'assistant', remove it to ensure a valid sequence (User must come first)
      if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
        apiMessages.shift()
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: apiMessages,
          userLocation 
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      const content = data.content || "I apologize, I received an invalid response."
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: content,
        properties: data.properties
      }])

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: ERROR_FALLBACK_MSG
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-full shadow-2xl overflow-hidden"
          >
            {/* Attraction Ping Animation */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/30 rounded-full"
            />
            
            <Sparkles className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-12" />
            
            {/* Subtle Label */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute -left-28 bg-white text-[var(--primary)] px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl border border-gray-100 hidden group-hover:block"
            >
              Urugo AI
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="w-[90vw] sm:w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Urugo Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Always Elite</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === 'user' ? "bg-gray-100 text-gray-400" : "bg-[var(--primary)] text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  
                  <div className={cn(
                    "max-w-[85%] space-y-2",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-gray-900 text-white rounded-tr-none" 
                        : "bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100"
                    )}>
                      {msg.content}
                    </div>

                    {/* In-Chat Results */}
                    {msg.properties && msg.properties.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 mt-4 w-full">
                        {msg.properties.map((prop) => (
                          <CompactPropertyCard key={prop.id} property={prop} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about properties, landmarks..."
                  className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/30 transition-all placeholder:text-gray-400 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 mt-3 text-center font-bold uppercase tracking-widest opacity-60">
                Urugo Assistant AI · Powered by Groq
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
