import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Register } from './register/register';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
  SharedModule,
  AuthRoutingModule
]
})
export class AuthModule {}
