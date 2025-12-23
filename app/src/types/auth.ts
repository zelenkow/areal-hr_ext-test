export interface LoginData {
  login: string
  password: string
}

export interface AuthResponse {
  id: number
  login: string
  role: string
  last_name: string
  first_name: string
  middle_name: string
}
