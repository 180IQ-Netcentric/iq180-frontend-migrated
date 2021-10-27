import i18n from '../locales/i18n'
export interface AuthenticationErrorMessage {
  message: string
  reason: string
}

export const signUpError = (reason: string) => {
  switch (reason) {
    case 'BAD_REQUEST':
      return {
        title: i18n.t('74'),
        description: i18n.t('75'),
      }
    case 'INVALID_USERNAME':
      return {
        title: i18n.t('74'),
        description: i18n.t('76'),
      }
    case 'USERNAME_ALREADY_USED':
      return {
        title: i18n.t('74'),
        description: i18n.t('77'),
      }
    default:
      return {
        title: i18n.t('74'),
        description: i18n.t('78'),
      }
  }
}

export const signInError = (reason: string) => {
  switch (reason) {
    case 'BAD_REQUEST':
      return {
        title: i18n.t('79'),
        description: i18n.t('80'),
      }
    case 'INCORRECT_USERNAME_OR_PASSWORD':
      return {
        title: i18n.t('79'),
        description: i18n.t('81'),
      }
    default:
      return {
        title: i18n.t('79'),
        description: i18n.t('78'),
      }
  }
}

export const scoreboardError = (reason: string) => {
  switch (reason) {
    case 'Unauthorized':
      return {
        title: i18n.t('83'),
        description: i18n.t('84'),
      }
    case 'INVALID_TOKEN':
      return {
        title: i18n.t('85'),
        description: i18n.t('86'),
      }
    case 'TOKEN_IS_REQUIRED':
      return {
        title: i18n.t('87'),
        description: i18n.t('88'),
      }
    default:
      return {
        title: i18n.t('89'),
        description: i18n.t('78'),
      }
  }
}

export const usernameError = (reason: string) => {
  switch (reason) {
    case 'BAD_REQUEST':
      return {
        title: i18n.t('94'),
        description: i18n.t('91'),
      }
    case 'INVALID_USERNAME':
      return {
        title: i18n.t('92'),
        description: i18n.t('93'),
      }
    case 'Unauthorized':
      return {
        title: i18n.t('94'),
        description: i18n.t('95'),
      }
    case 'INVALID_TOKEN':
      return {
        title: i18n.t('94'),
        description: i18n.t('96'),
      }
    case 'TOKEN_IS_REQUIRED':
      return {
        title: i18n.t('94'),
        description: i18n.t('97'),
      }
    case 'NOT_FOUND':
      return {
        title: i18n.t('94'),
        description: i18n.t('90'),
      }
    default:
      return {
        title: i18n.t('89'),
        description: i18n.t('78'),
      }
  }
}
