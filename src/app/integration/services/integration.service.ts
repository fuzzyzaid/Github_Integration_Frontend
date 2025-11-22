import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  private baseUrl = 'http://localhost:3000/integration';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`);
  }

  removeIntegration(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove`);
  }
}
