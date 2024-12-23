import { Component, OnInit } from '@angular/core';
import { ApiservicesService } from '../apiservices.service';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../AuthService.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private apiservices: ApiservicesService,private authservice:AuthService) { }
  pdfname: string[] = [];
  userName:string = '';
  emailAddress:string = '';
  ngOnInit() {
    this.getallPdf();
    this.extractUserName();
  }

  getallPdf() {
    try {
      this.apiservices.getallPdf().subscribe({
        next: (data: { success: boolean; pdfNames?: string[]; message?: string }) => {

          this.pdfname = data.pdfNames || [];
          console.log('API Response:', this.pdfname);
        },
        error: (error: any) => {
          console.error('API Error:', error);
        },
        complete: () => {
          console.log('API call completed.');
        }
      });

    } catch (error) {
      console.error(error);
    }

  }


  downloadPDF(fileName: string, isview: boolean) {



    this.apiservices.downloadpdf(fileName).subscribe({
      next: (data: { success: boolean; base64Pdf?: string; message?: string }) => {
        if (data.success) {
          if (data.base64Pdf) {
            if (isview) {
              this.viewPDF(data.base64Pdf);
            }
            else {
              this.downloadFile(data.base64Pdf, fileName);
            }
          } else {
            console.error("Download failed. File is missing.");
          }
        } else {
          console.error(data.message || "Download failed. Please try again.");
        }
      }
    });

  }


  downloadFile(data: any, fileName: string) {
    const linkSource = `data:application/pdf;base64,${data}`;
    const downloadLink = document.createElement('a');
    const downloadFileName = `${fileName}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = downloadFileName;
    downloadLink.click();
  }


  replcaeext(str: string) {
    return str.replace('.pdf', '');
  }
  extractUserName() {
    const token = this.authservice.getToken(); // Assuming you have a method to get the token
    if (token) {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      this.userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'Unknown';
      this.emailAddress = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || 'Unknown';
    }
  }


  viewPDF(base64String: string) {
    // const linkSource = `data:application/pdf;base64,${base64String}`;
    // const pdfWindow = window.open();
    // pdfWindow?.document.write(
    //   `<iframe width='100%' height='100%' src='${linkSource}'></iframe>`
    // );


    const linkSource = `data:application/pdf;base64,${base64String}`;
    const pdfFrame: any = document.getElementById('pdfFrame');
    pdfFrame.src = linkSource;
    const pdfModalElement = document.getElementById('pdfModal');
    if (pdfModalElement) {
      const pdfModal = new bootstrap.Modal(pdfModalElement);
      pdfModal.show();
    } else {
      console.error('PDF modal element not found.');
    }
  }
  logout() {
    this.authservice.logout();
    window.location.reload();
  }
}




