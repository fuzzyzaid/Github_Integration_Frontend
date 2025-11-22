import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationConnectComponent } from './components/integration-connect/integration-connect.component';


@NgModule({
  declarations: [
    IntegrationConnectComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule
  ],
 // exports: [IntegrationConnectComponent]
})
export class IntegrationModule { }
