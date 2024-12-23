import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {
   baseUrl = 'https://localhost:7220/api';
  constructor(private http: HttpClient) { }

  login(userNameorEmailAddress:string ,password:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/User/Login?userNameOrEmail=${userNameorEmailAddress}&password=${password}`);
  }

  getallPdf(): Observable<any> {
    return this.http.get(`${this.baseUrl}/User/GetAllPdf`);
  }

  downloadpdf(pdfName:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/User/ReadPdf/${pdfName}`);
  }
}
