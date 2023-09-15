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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css'],
})
export class HouseDetailComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('CreateModal') CreateModal!: ElementRef;
  apartmentCreateForm!: FormGroup;
  apartmentEditForm!: FormGroup;
  houseId!: number;
  activeModals: NgbModalRef[] = [];
  isManager: boolean = false;
  isResident: boolean = false;
  apartmentId!: number;
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


  constructor(
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HomesApiService,
    private formBuilder: FormBuilder,
    private AuthorizeService: AuthorizeService
  ) { }
  ngOnInit(): void {
    this.manager();
    this.initializeFormEdit();
    this.initializeFormCreate();
    this.UserApartmentsCheck();
    this.getHouses();
  }

  UserApartmentsCheck() {
    this.AuthorizeService.getAccessToken().subscribe(
      (userRole: string | null) => {
        if (userRole !== null && !this.isManager) {
          const token: any = jwtDecode(userRole);
          const houseId = token.apartmentid;
          this.houseService
            .GetApartmentById(houseId)
            .subscribe((apartment: Apartment) => {
              this.apartments = [apartment];
            });
        } else {
          this.getHouses();
          this.route.params
            .pipe(
              switchMap((params) => {
                this.houseId = +params['id'];
                return this.getHouseDetails(this.houseId || 0);
              })
            )
            .subscribe((response: House) => {
              this.housedetails = response;

              if (this.houseId !== undefined) {
                this.getApartmentsByHouseId(this.houseId);
              }
            });
        }
      }
    );
  }


  initializeFormEdit() {
    this.apartmentEditForm = this.formBuilder.group({
      id: [null, Validators.required],
      number: [null, Validators.required],
      floor: [null, Validators.required],
      numberOfRooms: [null, Validators.required],
      population: [null, Validators.required],
      fullArea: [null, Validators.required],
      livingSpace: [null, Validators.required],
      houseId: [null, Validators.required],
    });
  }

  initializeFormCreate() {
    this.apartmentCreateForm = this.formBuilder.group({
      id: [null, Validators.required],
      number: [null, Validators.required],
      floor: [null, Validators.required],
      numberOfRooms: [null, Validators.required],
      population: [null, Validators.required],
      fullArea: [null, Validators.required],
      livingSpace: [null, Validators.required],
      houseId: [null, Validators.required],
    });
  }


  openEditApartmentModal(apartmentId: number) {
    this.apartmentId = apartmentId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);
    this.getApartmentDetails(this.apartmentId).subscribe({
      next: (response: Apartment) => {
        this.apartmentEditForm.setValue({
          id: response.id,
          number: response.number,
          floor: response.floor,
          numberOfRooms: response.numberOfRooms,
          population: response.population,
          fullArea: response.fullArea,
          livingSpace: response.livingSpace,
          houseId: response.houseId,
        });
        this.apartmentEditForm.markAsPristine();
        this.apartmentEditForm.markAsUntouched();
      },
    });
  }


  onFormSubmitEdit() {
    if (this.apartmentEditForm.valid) {
      const formData = this.apartmentEditForm.value;
      const apartmentId = formData.id;

      this.houseService.UpdateApartment(apartmentId, formData).subscribe({
        next: () => {
        }
      });
      this.closeModalAndRefresh();

    }
  }


  onFormSubmitCreate() {
    if (this.apartmentCreateForm.valid) {
      const apartment: Apartment = this.apartmentCreateForm.value as Apartment;
      this.houseService.CreateApartment(apartment).subscribe(
      );
      this.closeModalAndRefresh();
    }
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
    this.AuthorizeService.getAccessToken().subscribe(
      (userRole: string | null) => {
        if (userRole !== null) {
          const token: any = jwtDecode(userRole);
          const role = token.role;

          this.isManager = role === 'Manager';
          this.isResident = role === 'Resident';
        } else {
          this.isManager = false;
          this.isResident = false;
        }
      }
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.open(this.CreateModal);
    this.activeModals.push(modalRef);
  }

  async Delete() {
    const apartmentId = this.apartmentEditForm.get('id')?.value;
    const result = this.openConfirmationModal();
    if (await result) {
      this.deletApartment(this.apartmentId);
    } else {
    }
  }
  deletApartment(apartmentId: number) {
    this.houseService.DeleteApartment(apartmentId).subscribe({
      next: (response) => {
        this.closeModalAndRefresh();
      },
    });
  }
  openConfirmationModal(): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(
      DeleteConfirmationModalComponent
    );
    this.activeModals.push(modalRef);

    return modalRef.result
      .then((result) => {
        return result === true;
      })
      .catch(() => {
        return false;
      });
  }
  closeModalAndRefresh() {
    this.activeModals.forEach((modalRef) => {
      modalRef.dismiss();
    });
    this.activeModals = [];
    location.reload();

  }
}
