import React from 'react'
import { useTranslation } from 'react-i18next'
import Tips from '../../../components/tips/Tips'

const WaitingScreen = () => {
  const { t } = useTranslation()
  return (
    <div className='waiting-screen-container'>
      <h4>{t('72')}</h4>
      <Tips />
    </div>
  )
}

export default WaitingScreen
