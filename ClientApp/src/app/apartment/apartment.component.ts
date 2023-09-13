
import { Apartment } from './../Models/apartment.model';
import { Resident } from './../Models/resident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../Services/homes-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Observable, map } from 'rxjs';
import { HouseDetailComponent } from '../house-detail/house-detail.component';


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})




export class ApartmentComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('CreateModal') CreateModal!: ElementRef;
  ResidentEdit!: FormGroup;
  ResidentCreate!: FormGroup;
  apartmentId!: number;
  residentId!: number;
  isManager: boolean = false;
  isResident: boolean = false;
  apartments: Apartment[] = [];
  activeModals: NgbModalRef[] = [];
  residents!: Resident[];
  currentUser: any;

  residentdetails: Resident = {
    id: 0,
    name: '',
    surname: '',
    personalCode: '',
    dateOfBirth: new Date(2000, 0, 1),
    phone: '',
    email: '',
    isOwner: false,
    apartmentId: 0
  }
  constructor(
    public modalService: NgbModal,
    private houseService: HomesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private AuthorizeService: AuthorizeService,
  ) { }

  ngOnInit() {
    this.manager();
    this.residentApartment();
    this.initializeFormEdit();
    this.initializeFormCreate();
    this.getApartments();


  }
  initializeFormEdit() {
    this.ResidentEdit = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      personalCode: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      isOwner: [false],
      apartmentId: ['']
    });
  }

  initializeFormCreate() {
    this.ResidentCreate = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      personalCode: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      isOwner: [false],
      apartmentId: ['']
    });
  }
  openEditResidentModal(residentId: number) {
    this.residentId = residentId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);

    this.getResidentDetails(this.residentId).subscribe({
      next: (response: Resident) => {
        this.residentdetails = response;
        this.ResidentEdit.patchValue({
          id: response.id,
          name: response.name,
          surname: response.surname,
          personalCode: response.personalCode,
          dateOfBirth: response.dateOfBirth,
          phone: response.phone,
          email: response.email,
          isOwner: response.isOwner,
          apartmentId: response.apartmentId
        });
      },
    });
  }

  residentApartment() {
    this.route.params.subscribe(params => {
      this.apartmentId = +params['id'];
    });
    this.getApartmentsResidents(this.apartmentId);
    this.AuthorizeService.getUser().subscribe(data => {
      if (data && data.name) {
        this.currentUser = data.name;
      }
    });
  }
  openCreateResidentModal() {
    const modalRef = this.modalService.open(this.CreateModal);
    this.activeModals.push(modalRef);
  }


  onFormSubmitEdit() {
    if (this.ResidentEdit.valid) {
      const formData = this.ResidentEdit.value;
      const residentId = formData.id;
      this.houseService.UpdateResident(residentId, formData).subscribe((response) => {
        this.closeModalAndRefresh();
      });
    }
  }
  onFormSubmitCreate() {
    if (this.ResidentCreate.valid) {
      const resdident: Resident = this.ResidentCreate.value as Resident;
      this.houseService.CreateResident(resdident).subscribe(
      );
      this.closeModalAndRefresh();
    }
  }


  getApartments() {
    this.houseService.getAllApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }

  getResidentDetails(residentId: number) {
    return this.houseService.GetResidentById(residentId);
  }

  getApartmentsResidents(Apartmentid: number) {
    this.houseService.GetApartmentsResident(Apartmentid).subscribe(
      (residents: Resident[]) => {
        this.residents = residents;

      },
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


  async Delete() {
    const residentId = this.ResidentEdit.get('id')?.value;
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteResident(this.residentId)
    } else {
    }
  }
  deleteResident(residentId: number) {

    this.houseService.DeleteResident(residentId).subscribe({
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
      this.router.navigate(['apartments/' + this.residentdetails.apartmentId + '/residents']))
    location.reload();
  }


}
