export interface Contact{
    id: string | number,
    name: string,
    email: string,
    phone: string,
    title: string,
    message: string,
    createdAt?: string,
    updatedAt?: string
}