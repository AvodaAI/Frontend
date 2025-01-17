export interface LoginResponse {
    access_token: string;
    refresh_token: string;
  }
  
  export interface Login {
    email: string;
    password: string;
  }