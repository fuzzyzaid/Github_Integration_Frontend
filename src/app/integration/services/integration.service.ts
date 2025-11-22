import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  private baseUrl = 'http://localhost:3000/integration';

  constructor(private http: HttpClient) {}

  getStatus(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`, { params: { username } });
  }

   resyncIntegration(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resync`, { username });
  }

  removeIntegration(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, { username });
  }

}
