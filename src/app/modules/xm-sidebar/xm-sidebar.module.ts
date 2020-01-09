import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { XmSharedModule } from '../../shared/shared.module';

import { LogoComponent } from './logo/logo.component';
import { MenuLinkComponent } from './menu/menu-link.component';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar.component';
import { UserComponent } from './user/user.component';

@NgModule({
    declarations: [
        SidebarComponent,
        LogoComponent,
        MenuComponent,
        UserComponent,
        MenuLinkComponent,
    ],
    imports: [
        XmSharedModule,
        RouterModule,
        CommonModule,
    ],
    exports: [SidebarComponent],
})
export class XmSidebarModule {}
