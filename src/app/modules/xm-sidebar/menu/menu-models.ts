export type JavascriptCode = string;

export interface MenuItem {
    class?: string;
    position: number;
    permission?: string | string[];
    url: string[];
    icon: string;
    title: string;
}

export interface MenuCategory extends MenuItem {
    isLink: boolean;
    key: string;
    children: MenuItem[];
}
