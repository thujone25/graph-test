import {CREDENTIALS} from '@/constants/credentials';

export const isAuthenticated = () => {
  return !!localStorage.getItem('app_auth_token');
}

export const authenticate = (creds) => {
  if (creds.email === CREDENTIALS.EMAIL && creds.email === CREDENTIALS.PASSWORD) {
    return 'imagineItIsAnAuthToken';
  } else {
    return {error: 'Credentials are not valid'}
  }
}
