import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgxPopper } from 'angular-popper';

@NgModule({
       bootstrap: [AppComponent],

       imports: [
              BrowserModule.withServerTransition({ appId: 'swag-root' }),
              BrowserTransferStateModule,
              AppModule,
              NgxPopper,
       ]
})
export class AppBrowserModule { }
