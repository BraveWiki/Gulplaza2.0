'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Send, Loader2, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  ref,
  push,
  onChildAdded,
  query,
  orderByChild,
  limitToLast,
  DataSnapshot,
} from 'firebase/database'

interface ChatMessage {
  id: string
  senderId: string
  senderRole: 'buyer' | 'seller'
  content: string
  timestamp: number
}

interface ChatProps {
  productId: string
  shopkeeperId: string
  isOpen?: boolean
  onClose?: () => void
}

export function Chat({ productId, shopkeeperId, isOpen = false, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [firebaseAvailable, setFirebaseAvailable] = useState(false)
  const [currentUserId] = useState(() => {
    // Generate a persistent user ID for this session
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('chat-user-id')
      if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('chat-user-id', userId)
      }
      return userId
    }
    return `user-${Date.now()}`
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!productId || typeof window === 'undefined') return

    const initChat = async () => {
      try {
        // Import Firebase dynamically
        const firebaseModule = await import('@/lib/firebase')
        const database = firebaseModule.database

        // Check if database is available
        if (!database) {
          console.warn('⚠️ Firebase not initialized. Chat disabled.')
          setFirebaseAvailable(false)
          return
        }

        setFirebaseAvailable(true)

        // Reference to chat room for this product
        const chatRoomRef = ref(database, `chat-rooms/${productId}/messages`)

        // Query last 50 messages
        const messagesQuery = query(chatRoomRef, orderByChild('timestamp'), limitToLast(50))

        // Listen for new messages
        const onMessageAdded = (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const message = snapshot.val()
            setMessages((prev) => {
              // Check if message already exists
              if (prev.find((m) => m.id === snapshot.key)) {
                return prev
              }
              return [
                ...prev,
                {
                  id: snapshot.key!,
                  senderId: message.senderId,
                  senderRole: message.senderRole,
                  content: message.content,
                  timestamp: message.timestamp,
                },
              ]
            })
            setIsConnected(true)
          }
        }

        // Subscribe to new messages
        const unsubscribe = onChildAdded(messagesQuery, onMessageAdded)
        cleanupRef.current = unsubscribe

        setIsConnected(true)
      } catch (error) {
        console.error('❌ Chat initialization error:', error)
        setFirebaseAvailable(false)
      }
    }

    initChat()

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [productId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending || !productId || !firebaseAvailable) return

    setIsSending(true)

    try {
      // Import Firebase dynamically
      const firebaseModule = await import('@/lib/firebase')
      const database = firebaseModule.database

      if (!database) {
        console.warn('⚠️ Firebase not available')
        return
      }

      const chatRoomRef = ref(database, `chat-rooms/${productId}/messages`)

      await push(chatRoomRef, {
        senderId: currentUserId,
        senderRole: 'buyer',
        content: inputMessage.trim(),
        timestamp: Date.now(),
      })

      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSenderName = (message: ChatMessage) => {
    if (message.senderId === currentUserId) {
      return 'You'
    }
    return message.senderRole === 'seller' ? 'Seller' : 'Buyer'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Chat with Seller</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {!firebaseAvailable ? (
                  <Badge variant="secondary" className="text-xs">
                    Chat Unavailable
                  </Badge>
                ) : (
                  <>
                    <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                      {isConnected ? 'Connected' : 'Connecting...'}
                    </Badge>
                    {!isConnected && <Loader2 className="w-3 h-3 animate-spin" />}
                  </>
                )}
              </div>
            </div>
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {!firebaseAvailable ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Chat is temporarily unavailable</p>
                  <p className="text-sm text-gray-400 mt-2">Firebase configuration required</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Start a conversation with the seller</p>
                  <p className="text-sm text-gray-400 mt-2">Messages are anonymous</p>
                </div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex flex-col ${message.senderId === currentUserId ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <span className="text-xs text-gray-500 mb-1">{getSenderName(message)}</span>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.senderId === currentUserId
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  firebaseAvailable
                    ? "Type your message..."
                    : "Chat is unavailable"
                }
                disabled={!firebaseAvailable || !isConnected || isSending}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!firebaseAvailable || !isConnected || !inputMessage.trim() || isSending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
