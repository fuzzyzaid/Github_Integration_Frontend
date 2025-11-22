import { Component } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-integration-connect',
  standalone: false,
  templateUrl: './integration-connect.component.html',
  styleUrl: './integration-connect.component.css'
})
export class IntegrationConnectComponent {


   connected = false;
  connectedDate: Date | null = null;
  username = "";
  avatar = "";

  constructor(
    private integrationService: IntegrationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['status'] === 'success') {
      this.loadStatus(); // Call only after OAuth redirect
    } else {
      // optional: loadStatus() on page refresh
      this.loadStatus();
    }
  });
}

  loadStatus() {
    this.integrationService.getStatus().subscribe((res: any) => {
      this.connected = res.connected;
      if (res.connected) {
        this.connectedDate = res.connectedAt;
        this.username = res.username;
        this.avatar = res.avatar;
      }
    });
  }

  connectGithub() {
    window.location.href = 'http://localhost:3000/auth/github';
  }

}
