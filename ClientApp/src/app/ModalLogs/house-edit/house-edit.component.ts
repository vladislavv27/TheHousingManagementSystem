import { Component, EventEmitter, Injectable, OnInit } from '@angular/core';
import { Apartment } from '../../Models/apartment.model';
import { House } from '../../Models/house.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../../Services/homes-api.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-house-edit',
  templateUrl: './house-edit.component.html',
  styleUrls: ['./house-edit.component.css']
})

export class HouseEditComponent implements OnInit {
  houseId: number | undefined;
  showEditModal: boolean = false;
  modalRef!: NgbModalRef;
  isManager: boolean = false;
  apartmentId: number | undefined;
  isResident: boolean = false;
  house: House | undefined;
  showEditForm: boolean | undefined;
  housedetails:House={
    id: 0,
    number: 0,
    street: '',
    city: '',
    country: '',
    postcode: '',
  }
  public closeEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    public modalService:NgbModal,
    private route: ActivatedRoute,
    private router:Router, 
    private houseService: HomesApiService,
    public activeModal: NgbActiveModal,
    

  ) { }
  
  ngOnInit(): void {
    if (this.houseId) {
      this.getHouseDetails(this.houseId).subscribe({
        next: (response: House) => {
          this.housedetails = response;
        }
      });
    };
    
  }
  getHouseDetails(houseId: number) {
    return this.houseService.getHouseById(houseId);
  }
  


  
  checkAndUpdateHouse(house: House) {
    const houseNumberToCheck = house.number;
    this.houseService.doesHouseExistByNumber(houseNumberToCheck).subscribe((exists) => {
      if (exists) {
        this.houseService.UpdateHouse(this.housedetails.id, this.housedetails).subscribe({
          next: (response) => {
            this.router.navigate(['all-houses']);
          }
        });
      } else {
        this.houseService.CreateHouse(this.housedetails).subscribe({
          next: (createdHouse) => {
            this.router.navigate(['all-houses']);
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