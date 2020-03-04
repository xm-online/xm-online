import { InjectionToken } from '@angular/core';

export interface XmCoreConfig {
    UI_CONFIG_PUBLIC_URL: string;
    UI_CONFIG_PRIVATE_URL: string;
    USER_URL: string;
}

export const XM_CORE_CONFIG = new InjectionToken<XmCoreConfig>('XM_CORE_CONFIG');
export const XM_CORE_EXTERNAL_CONFIG = new InjectionToken<XmCoreConfig>('XM_CORE_EXTERNAL_CONFIG');

export const XM_CORE_CONFIG_DEFAULT: XmCoreConfig = {
    UI_CONFIG_PUBLIC_URL: 'config/api/profile/webapp/settings-public.yml?toJson',
    UI_CONFIG_PRIVATE_URL: 'config/api/profile/webapp/settings-private.yml?toJson',
    USER_URL: 'uaa/api/account',
};
