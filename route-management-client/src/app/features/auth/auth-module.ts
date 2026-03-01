import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Register } from './register/register';

@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
