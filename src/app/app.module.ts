import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// material
import { MaterialModule } from './material';

// My components
import { PageMapComponent } from './page-map/page-map.component';
import { DailyRiskComponent } from './daily-risk/daily-risk.component';
import { DangerRatioComponent } from './danger-ratio/danger-ratio.component';
import { MembersComponent } from './members/members.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    PageMapComponent,
    DailyRiskComponent,
    DangerRatioComponent,
    MembersComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
