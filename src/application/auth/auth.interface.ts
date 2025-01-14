export interface AuthToken{
    accessToken: string,
    user: {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        profile: string,
        role: string[]
    }
}