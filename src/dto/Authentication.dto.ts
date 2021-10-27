export interface SignInInfo {
  username: string;
  password: string;
}

export interface User {
  isUser: boolean;
  jwt: string;
  lose: number;
  score: number;
  username: string;
  win: number;
}
export interface UserInfo {
  lose: number;
  score: number;
  username: string;
  win: number;
}
export interface SignUpResponse extends UserInfo {
  isUser: boolean;
  jwt: string;
}
