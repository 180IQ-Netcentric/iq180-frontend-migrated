import React, { ComponentType, FC } from 'react'
import { Redirect } from 'react-router'
import { getCookie } from '../utils/cookie'
import jwt_decode from 'jwt-decode'

export interface Token {
  role: 'Admin' | 'User'
  exp: number
  iat: number
}

function withAdminGuard<P>(Component: ComponentType<P>): FC<P> {
  const token = getCookie('token')
  const decodedToken = token ? jwt_decode<Token>(token) : undefined
  const role = decodedToken?.role

  return function withAdminGuard(props: P) {
    if (role !== 'Admin') {
      return <Redirect to='/' />
    } else {
      return <Component {...props} />
    }
  }
}

export default withAdminGuard
