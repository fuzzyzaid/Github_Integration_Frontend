import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GithubDataService } from '../../services/github-data.service';
import { IntegrationService } from '../../services/integration.service';

@Component({
  selector: 'app-github-view',
  standalone: false,
  templateUrl: './github-view.component.html',
  styleUrl: './github-view.component.css'
})
export class GithubViewComponent implements OnInit, OnChanges {

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

  orgLogin = '';
  repoName = '';
  search = '';
  page = 1;
  pageSize = 30;
  sortBy = '';
  sortDir: 'asc' | 'desc' = 'desc';

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };
  rowData: any[] = [];
  total = 0;
  totalPages = 1;
  loading = false;

  availableSortFields: string[] = [];

  constructor(
    private dataService: GithubDataService,
    private integrationService: IntegrationService
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
    this.orgLogin = value;
    this.page = 1;
    this.fetch();
  }

  onFilterRepoApply(value: string) {
    this.repoName = value;
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

  get rangeStart() {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }
  get rangeEnd() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  goFirst() { if (this.page !== 1) { this.page = 1; this.fetch(); } }
  goPrev() { if (this.page > 1) { this.page--; this.fetch(); } }
  goNext() { if (this.page < this.totalPages) { this.page++; this.fetch(); } }
  goLast() { if (this.page < this.totalPages) { this.page = this.totalPages; this.fetch(); } }

  /* -----------------------------------------------------
     FLATTEN OBJECTS FOR AG-GRID
  ------------------------------------------------------ */
  private flattenObject(obj: any, parentKey = '', result: any = {}): any {
    if (!obj || typeof obj !== 'object') return result;

    for (const key of Object.keys(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const val = obj[key];

      if (val && typeof val === 'object' && !Array.isArray(val)) {
        this.flattenObject(val, newKey, result);
      } else if (Array.isArray(val)) {
        result[newKey] = val
          .map(v => (typeof v === 'object' ? JSON.stringify(v) : v))
          .join(', ');
      } else {
        result[newKey] = val;
      }
    }
    return result;
  }

  private buildColumnsFromRows(rows: any[]) {
    if (!rows || !rows.length) {
      this.columnDefs = [];
      return;
    }

    const fields = Object.keys(rows[0]);
    this.availableSortFields = fields;

    this.columnDefs = fields.map(field => ({
      headerName: field,
      field: field,
      resizable: true,
      sortable: true,
      filter: true,
      valueGetter: params => params.data[field] ?? ''
    })) as ColDef[];
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
      next: res => {
        if (res.needsSync) {
          this.integrationService.resyncIntegration(this.username).subscribe({
            next: () => this.fetch(),
            error: () => (this.loading = false)
          });
          return;
        }

        this.rowData = (res.rows || []).map((r:any) => this.flattenObject(r));
        this.total = res.total || 0;

        this.buildColumnsFromRows(this.rowData);

        this.totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
          this.fetch();
          return;
        }

        this.loading = false;
      },
      error: err => {
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