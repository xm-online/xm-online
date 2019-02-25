import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { navbarRoute } from '../xm.route';
import { errorRoute } from './';

const LAYOUT_ROUTES = [
    navbarRoute,
    ...errorRoute
];

@NgModule({
  imports: [
    RouterModule.forRoot(LAYOUT_ROUTES, { useHash: false })
  ],
  exports: [
    RouterModule
  ]
})
export class LayoutRoutingModule {}
