import { House } from './../Models/house.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomesApiService } from '..//Services/homes-api.service'; 
import { Apartment } from '../Models/apartment.model'; 
import { Injectable } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { HouseEditComponent } from '../house-edit/house-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
