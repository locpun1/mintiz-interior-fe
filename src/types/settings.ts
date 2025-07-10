export interface IImageSlide{
    id: string | number,
    name: string,
    url: string,
    createdAt?: string,
    updatedAt?: string
}

export interface IServices{
    id: string | number,
    title: string,
    image_url: string,
    content: string,
    createdAt?: string,
    updatedAt?: string,
    order?: string | number,
    isReverse?: boolean
}