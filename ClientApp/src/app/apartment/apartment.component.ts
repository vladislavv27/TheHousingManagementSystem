
import { Apartment } from './../Models/apartment.model';
import { Resident } from './../Models/resident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../Services/homes-api.service';
import { FormGroup, NgModelGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Inject } from '@angular/core';
import { ResdidentDetailComponent } from '../ModalLogs/resdident-detail/resdident-detail.component';
import { ApartmentEditComponent } from '../ModalLogs/apartment-edit/apartment-edit.component';
import { DeleteConfirmationModalComponent } from '../ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';


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


  getApartmentsResidents(Apartmentid: number) {
    this.houseService.GetApartmentsResident(Apartmentid).subscribe(
      (residents: Resident[]) => {
        this.residents = residents;
      },
  
    );
  }
  deleteApartment(Apartmentid: number){
    this.houseService.DeleteApartment(Apartmentid).subscribe({
      next:(response)=>{
        this.router.navigate(['house/'+this.apartmentdetails.houseId])
      }
    })
  }
  hasResidents(apartmentId:number): boolean {
    return this.getApartmentsResidents(apartmentId)==null;
    
  }


   async Delete(Apartmentid: number) {
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteApartment(Apartmentid)
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
  openEditModal(residentId: number) {
    const modalRef = this.modalService.open(ResdidentDetailComponent);
    modalRef.componentInstance.residentId = residentId;
  }
  openEditModalEditApartment(apartmentId: number) {
    const modalRef = this.modalService.open(ApartmentEditComponent);
    modalRef.componentInstance.apartmentId = apartmentId;
  }

  }
