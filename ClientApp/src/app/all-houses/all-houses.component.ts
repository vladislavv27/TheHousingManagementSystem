import { Component, ElementRef, ViewChild } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {
  @ViewChild('editModal') editModal!: ElementRef;
  filteredHouses: House[] = [];
  filterValue = '';
  activeModals: NgbModalRef[] = [];
  housesId!:number;
  houses: House[] = [];
  isManager: boolean = false;
  isResident: boolean = false;
  filterInput$: Subject<string> = new Subject<string>();
  housedetails: House = {
    id: 0,
    number: 0,
    street: '',
    city: '',
    country: '',
    postcode: '',
  }

  constructor(private houseService: HomesApiService,
    public modalService: NgbModal,
    private router: Router,
    private AuthorizeService: AuthorizeService,

  ) { }
  ngOnInit(): void {
    this.manager();
    this.getHouses();
    this.filterInput$.subscribe((filterValue) => {
      if (!filterValue.trim()) {
        this.filteredHouses = this.houses;
      } else {
        this.filteredHouses = this.houses.filter((house) =>
          house.street.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });
  }
  onFilterInputChange() {
    this.filterInput$.next(this.filterValue);
  }

  applyFilter() {
    if (this.filterValue.trim() === '') {
      this.houses = this.houses;
    } else {
      this.houses = this.houses.filter((house) =>
        house.street.toLowerCase().includes(this.filterValue.toLowerCase())
      );
    }
  }
  getHouses() {
    this.houseService.getAllHouses().subscribe((data: House[]) => {
      this.houses = data;
      this.filteredHouses = data;
    });

  }
  openEditModal(housesId: number) {
    this.housesId = housesId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);
   
    this.getHousesDetails(this.housesId).subscribe({
     next: (response: House) => {
       this.housedetails = response;
     }
   });

  }
  getHousesDetails(housesId: number) {
    return this.houseService.getHouseById(housesId);
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

  deleteHouse(houseId: number) {
    this.houseService.DeleteHouse(houseId).subscribe({
      next: (response) => {
        this.router.navigate(['all-houses'])
        this.closeModalAndRefresh();
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


  checkAndUpdateHouse(house: House) {
    const houseNumberToCheck = house.number;
    this.houseService.doesHouseExistByNumber(houseNumberToCheck).subscribe((exists) => {
      if (exists) {
        this.houseService.UpdateHouse(this.housedetails.id, this.housedetails).subscribe({
          next: (response) => {
            this.router.navigate(['all-houses']);
          }
        });
        this.closeModalAndRefresh();
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
    this.activeModals.forEach(modalRef => {
      modalRef.dismiss();
    });
    this.activeModals = [];
    location.reload();
  }
}