import React, { ComponentType, FC, useContext } from 'react'
import { Redirect } from 'react-router'
import { UserContext } from '../contexts/userContext'
import { getCookie } from '../utils/cookie'

function withUserGuard<P>(Component: ComponentType<P>): FC<P> {
  return function WithUserGuard(props: P) {
    const { user } = useContext(UserContext)
    if (!user && getCookie('token') === undefined) {
      return <Redirect to='/signin' />
    } else {
      return <Component {...props} />
    }
  }
}

export default withUserGuard
