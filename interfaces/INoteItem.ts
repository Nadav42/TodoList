export interface INoteItem {
    _id: string;
    name: string;
    checked: boolean;
}

export interface IModifyItemForm {
    name: string;
    checked: boolean;
}