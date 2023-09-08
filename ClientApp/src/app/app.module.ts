import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { AllHousesComponent } from './all-houses/all-houses.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { ResdidentDetailComponent } from './ModalLogs/resdident-detail/resdident-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HouseEditComponent } from './ModalLogs/house-edit/house-edit.component';
import { ApartmentEditComponent } from './ModalLogs/apartment-edit/apartment-edit.component';
import { DeleteConfirmationModalComponent } from './ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';


@NgModule({
  declarations: [
    AllHousesComponent,
    ApartmentComponent,
    HouseDetailComponent,
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ResdidentDetailComponent,
    HouseEditComponent,
    ApartmentEditComponent,
    DeleteConfirmationModalComponent
    
  
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    ReactiveFormsModule,
    FormsModule,

    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


