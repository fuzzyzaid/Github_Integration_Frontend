import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationConnectComponent } from './components/integration-connect/integration-connect.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { IntegrationService } from './services/integration.service';


@NgModule({
  declarations: [
    IntegrationConnectComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    
  ],
  providers: [
  provideHttpClient(),
  IntegrationService
  ],


 // exports: [IntegrationConnectComponent]
})
export class IntegrationModule { }
