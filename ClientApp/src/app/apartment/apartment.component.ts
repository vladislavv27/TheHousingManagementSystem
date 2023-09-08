
import { Apartment } from './../Models/apartment.model';
import { Resident } from './../Models/resident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../Services/homes-api.service';
import { FormGroup, NgModelGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Inject } from '@angular/core';
import { ResdidentDetailComponent } from '../ModalLogs/resdident-detail/resdident-detail.component';
import { ApartmentEditComponent } from '../ModalLogs/apartment-edit/apartment-edit.component';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})




export class ApartmentComponent implements OnInit  {
  apartmentId: number | undefined;
  isManager: boolean = false;
  isResident: boolean = false;
  apartments: Apartment| undefined;
  showEditForm: boolean | undefined;
  residents: Resident[] = []; 
  selectedResident: Resident | undefined;
  showEditModal: boolean | undefined;
  apartmentForm: FormGroup | undefined; 
  currentUser: any;
  apartmentdetails:Apartment={
    id: 0,
    number: 0,
    floor: 0,
    numberOfRooms: 0,
    population: 0,
    fullArea: 0,
    livingSpace: 0,
    houseId: 0
  }
  constructor(
    public modalService:NgbModal,
    private houseService: HomesApiService,
    private route: ActivatedRoute,
    private router:Router,
    private AuthorizeService: AuthorizeService,
  ) { }
  
  ngOnInit() {
    this.manager();
    this.route.params.subscribe(params => {
      this.apartmentId = +params['id']; 
      this.getApartmentDetails(this.apartmentId).subscribe({
        next: (response: Apartment) => {
          this.apartmentdetails = response;
        }
      });
      this.getApartmentsResidents(this.apartmentId);
     
    });
    this.AuthorizeService.getUser().subscribe(data => {
      if (data && data.name) {
        this.currentUser = data.name;
      }
    });
  }

  getApartmentDetails(apartmentId: number) {
    return this.houseService.GetApartmentById(apartmentId);
  }


  getApartmentsResidents(Apartmentid: number) {
    this.houseService.GetApartmentsResident(Apartmentid).subscribe(
      (residents: Resident[]) => {
        this.residents = residents;
      },
  
    );
  }

  openEditModal(residentId: number) {
    const modalRef = this.modalService.open(ResdidentDetailComponent);
    modalRef.componentInstance.residentId = residentId;
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
