import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationConnectComponent } from './components/integration-connect/integration-connect.component';

const routes: Routes = [
  { path: 'connect', component: IntegrationConnectComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule { }
