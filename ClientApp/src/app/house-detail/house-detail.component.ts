import { House } from './../Models/house.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomesApiService } from '..//Services/homes-api.service'; 
import { Apartment } from '../Models/apartment.model'; 
import { Injectable } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { HouseEditComponent } from '../ModalLogs/house-edit/house-edit.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';
import { ApartmentEditComponent } from '../ModalLogs/apartment-edit/apartment-edit.component';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css']
})
export class HouseDetailComponent implements OnInit {
  houseId: number | undefined;
  isManager: boolean = false;
  apartmentId: number | undefined;
  isResident: boolean = false;
  house: House | undefined;
  apartments: Apartment[]| undefined;
  showEditForm: boolean | undefined;
  housedetails:House={
    id: 0,
    number: 0,
    street: '',
    city: '',
    country: '',
    postcode: '',
  }
  
  constructor(
    public modalService:NgbModal,
    private route: ActivatedRoute,
    private router:Router, 
    private houseService: HomesApiService,
    private AuthorizeService: AuthorizeService,

  ) { }
  ngOnInit(): void {
    this.manager();
    this.route.params.subscribe(params => {
      this.houseId = +params['id']; 
      this.getHouseDetails(this.houseId).subscribe({
        next: (response: House) => {
          this.housedetails = response;
        }
      });
      this.getApartmentsByHouseId(this.houseId);
    });
  }
  navigateToApartmentResidents(apartmentId: number) {
   console.log(apartmentId);
  }
  
  
  getHouseDetails(houseId: number) {
    return this.houseService.getHouseById(houseId);
  }
  
  openEditModal(houseId: number) {
    const modalRef = this.modalService.open(HouseEditComponent);
    modalRef.componentInstance.houseId = houseId;
  }
  
  getApartmentsByHouseId(houseId: number) {
    this.houseService.GetHouseApartments(houseId).subscribe(
      (apartments: Apartment[]) => {
        this.apartments = apartments;
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );
  }
   
  deleteHouse(houseId: number){
    this.houseService.DeleteHouse(houseId).subscribe({
      next:(response)=>{
        this.router.navigate(['all-houses'])
      }
    })

  }
   async Delete(houseId: number) {
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteHouse(houseId)
    } else {
    }
  }

  openConfirmationModal(): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(DeleteConfirmationModalComponent);

    return modalRef.result.then((result) => {
      return result === true;
    }).catch(() => {
      return false;
    });
  }
  openEditModalEditApartment(apartmentId: number) {
    const modalRef = this.modalService.open(ApartmentEditComponent);
    modalRef.componentInstance.apartmentId = apartmentId;
  }
  manager(): void {
    this.AuthorizeService.getAccessToken().subscribe((userRole: string | null) => {
      if (userRole !== null) {
        const token: any = jwtDecode(userRole);
        const role = token.role;
        
        this.isManager = role === 'Manager';
        this.isResident = role === 'Resident';
      } else {
        this.isManager = false;
        this.isResident = false;
      }
    });
  }


}
