export type JavascriptCode = string;

export interface MenuItem {
    position: number;
    permission: string;
    url: string[];
    icon: string;
    title: string;
}

export interface MenuCategory extends MenuItem {
    isLink: boolean;
    key: string;
    children: MenuItem[];
}
