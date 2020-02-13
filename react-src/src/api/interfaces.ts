export interface ITodoItem {
    "checked": boolean,
    "_id": string,
    "name": string,
    "createdAt": Date,
    "updatedAt": Date
}

export interface INote {
    _id: string,
    name: string,
    items: ITodoItem[],
    "createdAt": Date,
    "updatedAt": Date
}