import { Injectable, InjectionToken } from '@angular/core';

export interface XmCoreConfig {
    UI_PUBLIC_CONFIG_URL: string;
    UI_PRIVATE_CONFIG_URL: string;
    USER_URL: string;
}

export const XM_CORE_EXTERNAL_CONFIG = new InjectionToken<XmCoreConfig>('XM_CORE_EXTERNAL_CONFIG');

export const XM_CORE_CONFIG_DEFAULT: XmCoreConfig = {
    UI_PUBLIC_CONFIG_URL: 'config/api/profile/webapp/settings-public.yml?toJson',
    UI_PRIVATE_CONFIG_URL: 'config/api/profile/webapp/settings-private.yml?toJson',
    UI_PRIVATE_CONFIG_PERMISSION: 'CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM',
    USER_URL: 'uaa/api/account',
};

@Injectable({providedIn: 'root'})
export class XmCoreConfig {
    public UI_PUBLIC_CONFIG_URL: string = 'config/api/profile/webapp/settings-public.yml?toJson';
    public UI_PRIVATE_CONFIG_URL: string = 'config/api/profile/webapp/settings-private.yml?toJson';
    public UI_PRIVATE_CONFIG_PERMISSION: string = 'CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM';
    public USER_URL: string = 'uaa/api/account';
}
