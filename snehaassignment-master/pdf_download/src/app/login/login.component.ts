import { Component, OnInit } from '@angular/core';
import { ApiservicesService } from '../apiservices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../AuthService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usernameOrEmail!: string;
  password!: string;
  errorMessage: string = '';
  constructor(private userAppservices: ApiservicesService,
    private router: Router,private authservices :AuthService) { }

  ngOnInit() {
  }
  onSubmit() {
    try {
      this.userAppservices.login(this.usernameOrEmail, this.password).subscribe({
        next: (data: { success: boolean; token?: string; message?: string }) => {
          console.log('API Response:', data);
          if (data.success) {
            if (data.token) {
              this.authservices.login(data.token); 
              this.router.navigate(['/homepage']);// Pass the token to your auth service
            } else {
              this.errorMessage = "Login failed. Token is missing.";
            }
          } else {
            this.errorMessage = data.message || "Login failed. Please try again.";
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('API Error:', error);
          if (error.status === 401) {
            this.errorMessage = "Username or Password is Invalid";
          } else {
            this.errorMessage = "An error occurred. Please try again later.";
          }
        },
        complete: () => {
          console.log('API call completed.');
        }
      });
    } catch (error) {
      console.error(error);
    }

  }
}
