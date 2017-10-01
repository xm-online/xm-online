import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [ RouterModule, CommonModule, GateSharedModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
