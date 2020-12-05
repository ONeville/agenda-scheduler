import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, OverviewComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    // ButtonsModule,
    // WavesModule,
    // CardsFreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
