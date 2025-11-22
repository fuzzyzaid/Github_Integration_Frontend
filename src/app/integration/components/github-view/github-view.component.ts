import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GithubDataService } from '../../services/github-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-github-view',
  standalone: false,
  templateUrl: './github-view.component.html',
  styleUrl: './github-view.component.css'
})
export class GithubViewComponent {
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
  username = ''; // <-- use GitHub username
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
    private dataService: GithubDataService
  ) {}

  ngOnInit(): void {
    // Get username from URL
    this.username = this.route.snapshot.queryParamMap.get('username') || '';
    this.fetch();
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
    if (!this.username) return; // must have username

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
        this.total = res.total;
        this.rowData = res.rows;
        this.buildColumns(res.fields);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
