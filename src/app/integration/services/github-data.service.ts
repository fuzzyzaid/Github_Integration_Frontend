import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubDataService {
   private baseUrl = 'http://localhost:3000/github';


  constructor(private http: HttpClient) { }

   query(collection: string, options: {
    username: String;
    orgLogin?: string;
    repoName?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Observable<any> {
    let params = new HttpParams()
      .set('collection', collection)
      .set('username', String(options.username))
      .set('page', String(options.page || 1))
      .set('pageSize', String(options.pageSize || 50))
      .set('sortDir', options.sortDir || 'desc');

    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.orgLogin) params = params.set('orgLogin', options.orgLogin);
    if (options.repoName) params = params.set('repoName', options.repoName);
    if (options.search) params = params.set('search', options.search);

    return this.http.get(`${this.baseUrl}/data`, { params });
  }

}
