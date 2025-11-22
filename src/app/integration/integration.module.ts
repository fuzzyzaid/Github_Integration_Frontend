import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationConnectComponent } from './components/integration-connect/integration-connect.component';
import { provideHttpClient } from '@angular/common/http';
import { IntegrationService } from './services/integration.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    IntegrationConnectComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule
    
  ],
  providers: [
  provideHttpClient(),
  IntegrationService
  ],


 // exports: [IntegrationConnectComponent]
})
export class IntegrationModule { }
