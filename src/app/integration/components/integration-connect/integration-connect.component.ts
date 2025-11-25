import { Component } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-integration-connect',
  standalone: false,
  templateUrl: './integration-connect.component.html',
  styleUrl: './integration-connect.component.css'
})
export class IntegrationConnectComponent {

  connected = false;
  connectedDate: Date | null = null;
  lastSyncedAt: Date | null = null;
  username = "";
  avatar = "";

  showGithubView = false; 
  loading = false;
  removeSyncer=false;


  constructor(
    private integrationService: IntegrationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'success') {
        this.loading = true;
        this.username = params['user'] || "";
        this.loadStatus();
      } else {
        this.loadStatus();
      }
    });
  }

  loadStatus() {
    if (!this.username) return;
    this.integrationService.getStatus(this.username).subscribe((res: any) => {
      this.connected = res.connected;
      if (res.connected) {
        this.connectedDate = res.connectedAt;
        this.username = res.username;
        this.avatar = res.avatar;
      }
       this.loading = false; // stop loader
    });
  }

  connectGithub() {
    this.loading = true;
    window.location.href = 'http://localhost:3000/auth/github';
  }

 removeIntegration() {
  this.removeSyncer = true;
  this.integrationService.removeIntegration(this.username).subscribe({
    next: () => {
      this.connected = false;
      this.connectedDate = null;
      this.username = "";
      this.avatar = "";
      this.showGithubView = false;

      // reset URL params
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });

      this.removeSyncer = false; // hide spinner after success
    },
    error: (err) => {
      console.error('Remove integration failed', err);
      this.removeSyncer = false; // hide spinner on error
      alert("Failed to remove integration.");
    }
  });
}


resyncIntegration() {
  this.integrationService.resyncIntegration(this.username).subscribe((res: any) => {
    console.log("Resync result:", res);
    alert("Resync complete! Data updated.");
  });
}

onPanelOpened() {
    this.showGithubView = true; // instantiate child only when opened
  }

  onPanelClosed() {
    this.showGithubView = false; // optionally destroy child when closed
  }


}
