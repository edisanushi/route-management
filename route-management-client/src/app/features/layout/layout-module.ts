import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from './navbar/navbar';

@NgModule({
  declarations: [
    Navbar
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    Navbar
  ]
})
export class LayoutModule {}