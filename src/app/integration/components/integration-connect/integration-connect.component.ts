import { Component } from '@angular/core';

@Component({
  selector: 'app-integration-connect',
  standalone: false,
  templateUrl: './integration-connect.component.html',
  styleUrl: './integration-connect.component.css'
})
export class IntegrationConnectComponent {


  connected = false;
  connectedDate: Date | null = null;

  connectGithub() {
    // Redirect to backend to start OAuth flow
    window.location.href = 'http://localhost:3000/auth/github';
  }

}
