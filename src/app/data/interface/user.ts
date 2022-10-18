import { AppMode } from './../enum/app-mode';
export interface User {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date
}

export interface UserPreferences {
  mode: AppMode;
  locale: string;
  language: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
}

export interface UserState {
  preferences: UserPreferences;
  profile: UserProfile;
}
