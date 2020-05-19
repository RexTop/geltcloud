export type UserSecretModel = {
    id: string
    key: string
    value?: string | null
    owner: string | null
}

export const CreateUserSecretModel = (): UserSecretModel => (
    {
        id: '',
        key: '',
        value: '',
        owner: '',
    }
);
