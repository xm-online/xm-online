import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmSharedModule } from '../../shared/shared.module';
import { SidebarComponent } from './sidebar.component';

@NgModule({
    imports: [RouterModule, CommonModule, XmSharedModule],
    declarations: [SidebarComponent],
    exports: [SidebarComponent],
})

export class SidebarModule {}
