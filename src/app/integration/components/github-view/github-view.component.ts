import { Component, OnInit,OnChanges, Input, SimpleChanges } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GithubDataService } from '../../services/github-data.service';
import { ActivatedRoute } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-github-view',
  standalone: false,
  templateUrl: './github-view.component.html',
  styleUrl: './github-view.component.css'
})
export class GithubViewComponent  implements OnInit, OnChanges{
  @Input() username = '';
  @Output() removed = new EventEmitter<void>();
  @Output() resynced = new EventEmitter<void>();

  
  integrations = [{ label: 'Github', value: 'github' }];
  selectedIntegration = 'github';

  removing = false;
  resyncing = false;


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
  pageSize = 30;
  sortBy = '';
  sortDir: 'asc' | 'desc' = 'desc';

  // Grid state
  columnDefs: ColDef[] = [];
  defaultColDef = { sortable: false, filter: false, resizable: true };
  rowData: any[] = [];
  total = 0;
  loading = false;



  // helper
  availableSortFields: string[] = [];
  totalPages = 1;

  constructor(
    private dataService: GithubDataService,
    private integrationService:IntegrationService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange) {
      this.page = 1;
      this.fetch();
    }
  }


  onEntityChange(entity: string) {
    this.selectedEntity = entity;
    this.page = 1;
    this.sortBy = '';
    this.availableSortFields = [];
    this.fetch();
  }

  onSearchChange(value: string) {
    this.search = value;
    this.page = 1;
    this.fetch();
  }

  onFilterOrgApply(value: string) {
    this.orgLogin=value
    this.page = 1;
    this.fetch();
  }

   onFilterRepoApply(value: string) {
    this.repoName=value
    this.page = 1;
    this.fetch();
  }

  onPageSizeChange(size: number) {
    this.pageSize = Number(size);
    this.page = 1;
    this.fetch();
  }

  onSortChange(sortBy: string, sortDir: 'asc' | 'desc') {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.page = 1;
    this.fetch();
  }

  // pagination helpers
  get rangeStart() {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }
  get rangeEnd() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  goFirst() {
    if (this.page === 1) return;
    this.page = 1;
    this.fetch();
  }
  goPrev() {
    if (this.page <= 1) return;
    this.page--;
    this.fetch();
  }
  goNext() {
    if (this.page >= this.totalPages) return;
    this.page++;
    this.fetch();
  }
  goLast() {
    if (this.page >= this.totalPages) return;
    this.page = this.totalPages;
    this.fetch();
  }

  private buildColumns(fields: string[]) {
    this.availableSortFields = fields.slice();
    if (!this.sortBy && this.availableSortFields.length) {
      this.sortBy = this.availableSortFields.includes('createdAt') ? 'createdAt' : this.availableSortFields[0];
    }

    this.columnDefs = fields.map((field) => {
      const isDate = /at$/i.test(field) || field.toLowerCase().includes('date');
      return {
        headerName: field,
        field,
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: isDate ? (p) => (p.value ? new Date(p.value).toLocaleString() : '') : undefined
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
      sortBy: this.sortBy || undefined,
      sortDir: this.sortDir
    }).subscribe({
      next: (res) => {
        if (res.needsSync) {
          this.loading = true;
          this.integrationService.resyncIntegration(this.username).subscribe({
            next: () => this.fetch(),
            error: () => { this.loading = false; }
          });
          return;
        }

        this.loading = false;
        this.total = res.total || 0;
        this.rowData = res.rows || [];
        const fields = res.fields || [];
        this.buildColumns(fields);

        this.totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
          this.fetch();
          return;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch error', err);
        this.loading = false;
      }
    });
  }


  removeIntegration() {
  if (!this.username) return;

  this.removing = true;
  this.integrationService.removeIntegration(this.username).subscribe({
    next: () => {
      this.removing = false;
      this.removed.emit();     
    },
    error: () => {
      this.removing = false;
      alert("Failed to remove integration.");
    }
  });
}

resyncIntegration() {
  if (!this.username) return;

  this.resyncing = true;
  this.integrationService.resyncIntegration(this.username).subscribe({
    next: () => {
      this.resyncing = false;
      this.resynced.emit();
      this.fetch();             
    },
    error: () => {
      this.resyncing = false;
      alert("Re-sync failed.");
    }
  });
}


}