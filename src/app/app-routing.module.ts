import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { PageMapComponent } from './page-map/page-map.component';
import { DailyRiskComponent } from './daily-risk/daily-risk.component';
import { DangerRatioComponent } from './danger-ratio/danger-ratio.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: '', redirectTo:'welcome', pathMatch:'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'page-map', component: PageMapComponent },
  { path: 'daily-risk', component: DailyRiskComponent },
  { path: 'danger-ratio', component: DangerRatioComponent },
  { path: 'members', component: MembersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
