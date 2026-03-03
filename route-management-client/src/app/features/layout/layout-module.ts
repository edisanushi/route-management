import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { Shell } from './shell/shell';

@NgModule({
  declarations: [
    Navbar,
    Sidebar,
    Shell
  ],
  imports: [
    SharedModule
  ],
  exports: [
    Navbar,
    Sidebar,
    Shell
  ]
})
export class LayoutModule {}