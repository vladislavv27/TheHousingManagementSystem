import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Apartment } from 'src/app/Models/apartment.model';
import { Resident } from 'src/app/Models/resident.model';
import { HomesApiService } from 'src/app/Services/homes-api.service';

@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.css']
})
export class ApartmentEditComponent {
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
    public activeModal: NgbActiveModal,
    public modalService:NgbModal,
    private houseService: HomesApiService,
    private route: ActivatedRoute,
    private router:Router,
  ) { }
  
  ngOnInit(): void {
    if (this.apartmentId) {
      this.getApartmentDetails(this.apartmentId).subscribe({
        next: (response: Apartment) => {
          this.apartmentdetails = response;
        }
      });
    };
  }

  getApartmentDetails(apartmentId: number) {
    return this.houseService.GetApartmentById(apartmentId);
  }

  checkAndUpdateApartment(apartment: Apartment) {
    const ApartmentNumberToCheck = apartment.number;
    this.houseService.doesApartmentExistByNumber(ApartmentNumberToCheck,apartment.houseId).subscribe((exists) => {
      if (exists) {
        this.houseService.UpdateApartment(this.apartmentdetails.id, this.apartmentdetails).subscribe({
          next: (response) => {
            this.router.navigate(['house/'+this.apartmentdetails.houseId]);
          }
        });
        this.closeModalAndRefresh();
      } else {
        this.houseService.CreateApartment(this.apartmentdetails).subscribe({
          next: () => {
            this.router.navigate(['house/'+this.apartmentdetails.houseId]);
          }
        });
      }
  
      this.closeModalAndRefresh();
    });
  }

  closeModalAndRefresh() {
    this.activeModal.close();
 
  }
  }

