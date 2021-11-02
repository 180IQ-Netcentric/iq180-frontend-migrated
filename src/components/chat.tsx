import { Button, IconButton } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../contexts/socketContext'
import { UserContext } from '../contexts/userContext'
import RoundedTextField from './common/RoundedTextField'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import { useTranslation } from 'react-i18next'

type Chat = {
  username: string
  message: string
}

type Props = {
  toggleView: () => void
  className: string
}

const Chat = (props: Props) => {
  const { t } = useTranslation()
  const { toggleView, className } = props
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserContext)
  const [chatMessages, setChatMessages] = useState<Chat[]>([
    {
      username: 'iq180 bot',
      message: `Welcome, ${user?.username}`,
    },
  ])
  const [newMessage, setNewMessage] = useState('')

  const scrollToBottom = () => {
    const objDiv = document.getElementById('chat-container')
    if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
  }

  const submitChat = (e: any) => {
    e.preventDefault()
    if (!newMessage) return
    if (user) {
      const msgPayload = { username: user.username, message: newMessage }
      socket?.emit('chatMessage', msgPayload)
      setChatMessages([...chatMessages, msgPayload])
      setNewMessage('')
      scrollToBottom()
    }
  }

  useEffect(() => {
    socket?.on('sendChatMessage', ({ username, message }) => {
      const receivedMessage = { username: username, message: message }
      setChatMessages((old) => [...old, receivedMessage])
      scrollToBottom()
    })
  }, [])

  return (
    <div className={`chat-component ${className}`}>
      <div className='top-chat-section'>
        <div className='chat-header'>
          <div className='chat-title'>{t('111')}</div>
          <IconButton onClick={toggleView}>
            <InsertChartIcon />
          </IconButton>
        </div>
        <div className='chat-container' id='chat-container'>
          {chatMessages.map((chat, index) => (
            <div key={index} className='chat-message'>
              <div>
                <b>{chat.username}: </b>
                {chat.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bottom-chat-section'>
        <form onSubmit={submitChat} className='chat-form'>
          <RoundedTextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewMessage(e.target.value)
            }
            label={t('111')}
            sx={{ width: '100%', marginRight: '12px' }}
            value={newMessage}
          />
          <Button type='submit'>{t('112')}</Button>
        </form>
      </div>
    </div>
  )
}

export default Chat
