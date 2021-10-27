import React, { createContext, useState } from 'react'

export interface GameSettingsConstruct {
  showSettings: boolean
  setShowSettings: (value: boolean) => void
  musicOn: boolean
  toggleMusic: (value: boolean) => void
  soundEffectOn: boolean
  toggleSoundEffect: (value: boolean) => void
  musicTrack: number
  toggleMusicTrack: (value: number) => void
  background: number
  toggleBackground: (value: number) => void
  language: string
  toggleLanguage: (value: string) => void
}

export const GameSettingsContext = createContext({} as GameSettingsConstruct)

const GameSettingsContextProvider = ({ ...props }) => {
  const [showSettings, setShowSettings] = useState(false)
  const [musicOn, setMusicOn] = useState(
    window.localStorage.getItem('musicOn') === 'true'
  )
  const [soundEffectOn, setSoundEffectOn] = useState(
    window.localStorage.getItem('soundEffectOn') === 'true'
  )
  const [musicTrack, setMusicTrack] = useState(
    parseInt(window.localStorage.getItem('musicTrack') ?? '0')
  )
  const [background, setBackground] = useState(
    parseInt(window.localStorage.getItem('background') ?? '0')
  )
  const [language, setLanguage] = useState(
    window.localStorage.getItem('language') ?? 'en'
  )

  const toggleMusic = (value: boolean) => {
    setMusicOn(value)
    window.localStorage.setItem('musicOn', value.toString())
  }

  const toggleSoundEffect = (value: boolean) => {
    setSoundEffectOn(value)
    window.localStorage.setItem('soundEffectOn', value.toString())
  }

  const toggleMusicTrack = (value: number) => {
    setMusicTrack(value)
    window.localStorage.setItem('musicTrack', value.toString())
  }

  const toggleBackground = (value: number) => {
    setBackground(value)
    window.localStorage.setItem('background', value.toString())
  }

  const toggleLanguage = (value: string) => {
    setLanguage(value)
    window.localStorage.setItem('language', value.toString())
  }

  const value = {
    showSettings,
    setShowSettings,
    musicOn,
    toggleMusic,
    soundEffectOn,
    toggleSoundEffect,
    musicTrack,
    toggleMusicTrack,
    background,
    toggleBackground,
    language,
    toggleLanguage,
  }
  return <GameSettingsContext.Provider value={value} {...props} />
}

export default GameSettingsContextProvider
