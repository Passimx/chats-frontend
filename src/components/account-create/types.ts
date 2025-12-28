export type CreateUserType = { userId: string; words: string[] };

export type FuncType = [boolean, (password: string, name: string) => Promise<CreateUserType | undefined>];
