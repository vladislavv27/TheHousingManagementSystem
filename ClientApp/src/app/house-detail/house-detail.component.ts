import { House } from './../Models/house.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomesApiService } from '..//Services/homes-api.service';
import { Apartment } from '../Models/apartment.model';
import { Injectable } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css']
})
export class HouseDetailComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  houseId!: number;
  activeModals: NgbModalRef[] = [];
  isManager: boolean = false;
  isResident: boolean = false;
  apartmentId!: number;
  house!: House;
  apartments!: Apartment[];
  selectedHouse!: number;
  housesselector: House[] = [];
  housedetails: House = {
    id: 0,
    number: 0,
    street: '',
    city: '',
    country: '',
    postcode: '',
  };
  apartmentdetails: Apartment = {
    id: 0,
    number: 0,
    floor: 0,
    numberOfRooms: 0,
    population: 0,
    fullArea: 0,
    livingSpace: 0,
    houseId: 0
  };

  constructor(
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HomesApiService,
    private AuthorizeService: AuthorizeService,

  ) { }
  ngOnInit(): void {
    this.manager();
    this.checkfunc();
    this.getHouses();

  }

  checkfunc() {

    this.AuthorizeService.getAccessToken().subscribe((userRole: string | null) => {

      if (userRole !== null && !this.isManager) {
        const token: any = jwtDecode(userRole);
        const houseId = token.houseid;

        this.houseService.GetApartmentById(houseId).subscribe((apartment: Apartment) => {
          this.apartments = [apartment];
        });


      }
      else {
        this.getHouses();
        this.route.params.pipe(
          switchMap(params => {
            this.houseId = +params['id'];
            return this.getHouseDetails(this.houseId || 0);
          })
        ).subscribe((response: House) => {
          this.housedetails = response;

          if (this.houseId !== undefined) {
            this.getApartmentsByHouseId(this.houseId);
          }
        });
      }

    });
  }

  getHouses() {
    this.houseService.getAllHouses().subscribe((data: House[]) => {
      this.housesselector = data;
    });
  }
  getApartmentDetails(apartmentId: number) {
    return this.houseService.GetApartmentById(apartmentId);
  }

  onSelected(selectedHouse: number) {
    this.router.navigate(['house', selectedHouse]);
  }
  getHouseDetails(houseId: number) {
    return this.houseService.getHouseById(houseId);
  }


  openEditModal(apartmentId: number) {
    this.apartmentId = apartmentId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);

    this.getApartmentDetails(this.apartmentId).subscribe({
      next: (response: Apartment) => {
        this.apartmentdetails = response;
      }
    });

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
  checkAndUpdateApartment(apartment: Apartment) {
    const houseNumberToCheck = apartment.number;
    this.houseService.doesApartmentExistByNumber(houseNumberToCheck, apartment.houseId).subscribe((exists) => {
      if (exists) {
        console.log(exists)
        this.houseService.UpdateApartment(this.apartmentdetails.id, this.apartmentdetails).subscribe(() => {
        });
      } else if (!exists && this.isManager) {
        this.houseService.CreateApartment(this.apartmentdetails).subscribe(() => {
        });
      }
    });
    this.closeModalAndRefresh();

  }


  async Delete(apartmentId: number) {
    const result = this.openConfirmationModal();
    if (await result) {
      this.deletApartment(this.apartmentId)
    } else {
    }
  }
  deletApartment(apartmentId: number) {
    this.houseService.DeleteApartment(apartmentId).subscribe({
      next: (response) => {
        this.closeModalAndRefresh();
      }
    })
  }
  openConfirmationModal(): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(DeleteConfirmationModalComponent);
    this.activeModals.push(modalRef);


    return modalRef.result.then((result) => {
      return result === true;
    }).catch(() => {
      return false;
    });
  }
  closeModalAndRefresh() {
    this.activeModals.forEach(modalRef => {
      modalRef.dismiss();
    });
    this.activeModals = [];
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['house/' + this.apartmentdetails.houseId]))
  }


}
