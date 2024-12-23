import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiservicesService } from './apiservices.service';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './AuthService.service';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [		
    AppComponent,
      LoginComponent,
      HomepageComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiservicesService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
