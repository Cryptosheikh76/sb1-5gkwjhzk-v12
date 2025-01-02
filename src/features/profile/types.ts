export interface ProfileBio {
  bio?: string;
  location?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface ProfileUpdateData extends Partial<ProfileBio> {
  username?: string;
  avatar_url?: string;
}