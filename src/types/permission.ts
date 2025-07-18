export interface IAction{
    id: number,
    code: string,
    name: string,
    path?: string | null
}

export interface IMenu{
    id: number,
    code: string,
    name: string,
    path: string,
    icon?: string | null,
    actions: IAction[];
}

export interface GroupPermission{
  id: number,
  name: string,
  permission: IMenu[]
}