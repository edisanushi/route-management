import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ],
  exports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ]
})
export class SharedModule { }