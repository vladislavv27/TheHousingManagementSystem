import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllHousesComponent } from './all-houses/all-houses.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path:'all-houses',component:AllHousesComponent,canActivate: [AuthorizeGuard]},  
  { path: 'house/:id', component: HouseDetailComponent ,canActivate: [AuthorizeGuard],},
  { path: 'apartments/:id/residents', component: ApartmentComponent,canActivate: [AuthorizeGuard]},
  { path: 'counter', component: CounterComponent ,canActivate: [AuthorizeGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
