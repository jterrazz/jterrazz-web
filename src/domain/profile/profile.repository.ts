interface Profile {
    tagline: string;
    name: string;
    age: string;
    values: Value;
}
export interface ProfileRepository {
    getProfile(): Profile;
    getSocials(): string[];
    getSocial(type: string): string;
    getExperiences(): string[];
}

// Full-Stack Developer at Bridge by Bankin’ | Exploring the Intersection of Decentralization and FinTech with Open.MT
