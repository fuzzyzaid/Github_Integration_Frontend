import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationConnectComponent } from './components/integration-connect/integration-connect.component';
import { provideHttpClient } from '@angular/common/http';
import { IntegrationService } from './services/integration.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GithubViewComponent } from './components/github-view/github-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { GithubDataService } from './services/github-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [
    IntegrationConnectComponent,
    GithubViewComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatProgressSpinnerModule

    
  ],
  providers: [
  provideHttpClient(),
  IntegrationService,
  GithubDataService
  ],

})
export class IntegrationModule { }
