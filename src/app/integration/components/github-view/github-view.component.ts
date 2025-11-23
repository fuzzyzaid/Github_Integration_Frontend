import { Component, OnInit,OnChanges, Input, SimpleChanges } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GithubDataService } from '../../services/github-data.service';
import { ActivatedRoute } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';

@Component({
  selector: 'app-github-view',
  standalone: false,
  templateUrl: './github-view.component.html',
  styleUrl: './github-view.component.css'
})
export class GithubViewComponent  implements OnInit, OnChanges{
  @Input() username = '';
  integrations = [{ label: 'Github', value: 'github' }];
  selectedIntegration = 'github';

  entities = [
    { label: 'Organizations', value: 'github_orgs' },
    { label: 'Repos', value: 'github_repos' },
    { label: 'Commits', value: 'github_commits' },
    { label: 'Pulls', value: 'github_pulls' },
    { label: 'Issues', value: 'github_issues' },
    { label: 'Issue Changelogs', value: 'github_issue_events' },
    { label: 'Org Users', value: 'github_org_members' }
  ];
  selectedEntity = 'github_orgs';

  // Query state
  
  orgLogin = '';
  repoName = '';
  search = '';
  page = 1;
  pageSize = 50;
  sortBy = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  // Grid state
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  total = 0;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: GithubDataService,
    private integrationService:IntegrationService
  ) {}

  ngOnInit(): void {
    // Get username from URL
    this.username = this.route.snapshot.queryParamMap.get('user') || '';
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange) {
      // React if parent passes a new username
      this.page = 1;
      this.fetch();
    }
  }


  onEntityChange(entity: string) {
    this.selectedEntity = entity;
    if (!['github_repos','github_commits','github_pulls','github_issues','github_issue_events'].includes(entity)) {
      this.repoName = '';
    }
    this.page = 1;
    this.fetch();
  }

  onSearchChange(value: string) {
    this.search = value;
    this.page = 1;
    this.fetch();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetch();
  }

  onSortChange(sortBy: string, sortDir: 'asc' | 'desc') {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.fetch();
  }

  private buildColumns(fields: string[]) {
    this.columnDefs = fields.map((f) => {
      const isDate = /at$/i.test(f) || f.toLowerCase().includes('date');
      return {
        headerName: f,
        field: f,
        sortable: true,
        filter: 'agTextColumnFilter',
        valueFormatter: isDate ? (p) => (p.value ? new Date(p.value).toLocaleString() : '') : undefined,
        resizable: true
      } as ColDef;
    });
  }

  fetch() {
    if (!this.username) return;

    this.loading = true;
    this.dataService.query(this.selectedEntity, {
      username: this.username,
      orgLogin: this.orgLogin || undefined,
      repoName: this.repoName || undefined,
      search: this.search || undefined,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDir: this.sortDir
    }).subscribe({
      next: (res) => {
        if (res.needsSync) {
          // 🔥 Backend says no data, trigger sync
          this.integrationService.resyncIntegration(this.username).subscribe({
            next: () => this.fetch(), // after sync, fetch again
            error: () => this.loading = false
          });
        } else {
          this.total = res.total;
          this.rowData = res.rows;
          this.buildColumns(res.fields);
          this.loading = false;
        }
      },
      error: () => this.loading = false
    });
  }

}
