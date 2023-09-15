import { Component, ElementRef, ViewChild } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('CreateModal') CreateModal!: ElementRef;
  HouseEdit!: FormGroup;
  HouseCreate!: FormGroup;

  filterValue = '';
  activeModals: NgbModalRef[] = [];
  housesId!: number;
  filteredHouses: House[] = [];
  filterInput: Subject<string> = new Subject<string>();
  houses: House[] = [];
  isManager: boolean = false;
  isResident: boolean = false;
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
    private formBuilder: FormBuilder 

  ) {
  }
  ngOnInit(): void {
    this.manager();
    this.initializeFormEdit();
    this.initializeFormCreate();
    this.checkAutorization();
    this.filterInput.pipe().subscribe((filterValue) => {
      this.applyFilter(filterValue);
    });

  }



  initializeFormEdit() {
    this.HouseEdit = this.formBuilder.group({
      id: [null, Validators.required],
      number: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      postcode: [null, Validators.required],
      street: [null, Validators.required],
    });
  }

  initializeFormCreate() {
    this.HouseCreate = this.formBuilder.group({
      id: [null, Validators.required],
      number: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      postcode: [null, Validators.required],
      street: [null, Validators.required],
    });
  }

  openEditModal(housesId: number) {
    this.housesId = housesId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);

    this.getHousesDetails(this.housesId).subscribe({
      next: (response: House) => {
        this.housedetails = response;
        this.HouseEdit.setValue({
          id: response.id,
          number: response.number,
          city: response.city,
          country: response.country,
          postcode: response.postcode,
          street: response.street,
        });
      },
    });
  }

  onFormSubmitEdit() {
    if (this.HouseEdit.valid) {
      const formData = this.HouseEdit.value;
      const houseId = formData.id;
      this.houseService.UpdateHouse(houseId, formData).subscribe((response) => {
      });
      this.closeModalAndRefresh();

    }
  }

  async Delete() {
    const houseId = this.HouseEdit.get('id')?.value;
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteHouse(houseId)
    } else {
    }
  }
  deleteHouse(houseId: number) {
    this.houseService.DeleteHouse(houseId).subscribe({
      next: (response) => {
        this.router.navigate(['all-houses'])
        this.closeModalAndRefresh();
      }
    })
  
  }
  openConfirmationModal(): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(DeleteConfirmationModalComponent);
    return modalRef.result.then((result) => {
      return result === true;
    }).catch(() => {
      return false;
    });
  }

  onFormSubmitCreate(){
    if (this.HouseCreate.valid) {
      const newHouse: House = this.HouseCreate.value as House;
      this.houseService.CreateHouse(newHouse).subscribe(

      );
      this.closeModalAndRefresh();
    }
  }
  
  checkAutorization() {
    this.AuthorizeService.getAccessToken().subscribe((userRole: string | null) => {
      if (userRole !== null && !this.isManager) {
        const token: any = jwtDecode(userRole);
        console.log(token)

        const houseid = token.houseid;
        this.houseService.getHouseById(houseid).subscribe((house: any) => {
          this.filteredHouses = [house];
        });
      }
      else {
        this.getHouses();
      }
    });
  }

 onFilterInputChange() {
  this.filterInput.next(this.filterValue);
}


applyFilter(filterValue: string) {
  if (!filterValue.trim()) {
    this.filteredHouses = this.houses;
  } else {
    this.filteredHouses = this.houses.filter((house) =>
      house.street.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
}


  getHouses() {
    this.houseService.getAllHouses().subscribe((data: House[]) => {
      this.houses = data;
      this.filteredHouses = data;
    });
  }
  getHousesDetails(housesId: number) {
    return this.houseService.getHouseById(housesId);
  }

  openCreateModal() {
    this.HouseCreate.reset();
    const modalRef = this.modalService.open(this.CreateModal);
    this.activeModals.push(modalRef);
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


  closeModalAndRefresh() {
    this.activeModals.forEach(modalRef => {
      modalRef.dismiss();
    });
    this.activeModals = [];
    this.router.navigate(['all-houses']);
    location.reload();
  }
}