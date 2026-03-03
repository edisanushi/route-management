import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './handlers/global-error.handler';

@NgModule({
  imports: [
    CommonModule  
  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi:    true
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi:    true
    },
    {
      provide:  ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule.'
      );
    }
  }
}