
import { Apartment } from './../Models/apartment.model';
import { Resident } from './../Models/resident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../Services/homes-api.service';
import { FormGroup, NgModelGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Inject } from '@angular/core';
import { ResdidentDetailComponent } from '../resdident-detail/resdident-detail.component';


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})




export class ApartmentComponent implements OnInit  {
  apartmentId: number | undefined;
  apartments: Apartment| undefined;
  showEditForm: boolean | undefined;
  residents: Resident[] = []; 
  selectedResident: Resident | undefined;
  showEditModal: boolean | undefined;
  apartmentForm: FormGroup | undefined; 
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
  ) { }
  
  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.apartmentId = +params['id']; 
      this.getApartmentDetails(this.apartmentId).subscribe({
        next: (response: Apartment) => {
          this.apartmentdetails = response;
        }
      });
      this.getApartmentsResidents(this.apartmentId);
    
    });
  }

  getApartmentDetails(apartmentId: number) {
    return this.houseService.GetApartmentById(apartmentId);
  }
  updateApartment(){
    this.houseService.UpdateApartment(this.apartmentdetails.id,this.apartmentdetails).subscribe({
      next:(response)=>{
        this.router.navigate(['house/'+this.apartmentdetails.houseId])
      }
    })
  }

  getApartmentsResidents(Apartmentid: number) {
    this.houseService.GetApartmentsResident(Apartmentid).subscribe(
      (residents: Resident[]) => {
        this.residents = residents;
        console.log(residents);
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );
  }
  deleteApartment(Apartmentid: number){
    this.houseService.DeleteApartment(Apartmentid).subscribe({
      next:(response)=>{
        this.router.navigate(['house/'+this.apartmentdetails.houseId])
      }
    })
  }
  addApartment(apartment:Apartment){
    console.log(apartment);
    this.houseService.CreateApartment(this.apartmentdetails).subscribe({
      next:(apartment)=>{
        console.log(apartment);
        this.router.navigate(['house/'+this.apartmentdetails.houseId])
      }
    })
  }
  openEditModal(residentId: number) {
    const modalRef = this.modalService.open(ResdidentDetailComponent);
    modalRef.componentInstance.residentId = residentId;
  }

  }
