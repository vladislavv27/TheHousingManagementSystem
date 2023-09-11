
import { Apartment } from './../Models/apartment.model';
import { Resident } from './../Models/resident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../Services/homes-api.service';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApartmentEditComponent } from '../ModalLogs/apartment-edit/apartment-edit.component';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { DeleteConfirmationModalComponent } from '../ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})




export class ApartmentComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  apartmentId!: number;
  residentId!: number;
  isManager: boolean = false;
  isResident: boolean = false;
  apartments: Apartment[] = [];
  activeModals: NgbModalRef[] = [];
  residents!: Resident[];
  currentUser: any;
  apartmentdetails: Apartment = {
    id: 0,
    number: 0,
    floor: 0,
    numberOfRooms: 0,
    population: 0,
    fullArea: 0,
    livingSpace: 0,
    houseId: 0
  }
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
    private AuthorizeService: AuthorizeService,
  ) { }

  ngOnInit() {
    this.manager();
    this.getApartments();
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
  
  getApartments() {
    this.houseService.getAllApartments().subscribe((data: Apartment[]) => {
      this.apartments = data; 
      console.log(this.apartments)
    });
  }

  getAllApartments() {
    return this.houseService.getAllApartments();
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

  openEditModal(residentId: number) {
    this.residentId = residentId;
    const modalRef = this.modalService.open(this.editModal);
    this.activeModals.push(modalRef);
    this.getAllApartments();
    this.getResidentDetails(this.residentId).subscribe({
      next: (response: Resident) => {
        this.residentdetails = response;
      }
    });

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

  checkAndUpdateHouse(resdident: Resident) {
    const houseNumberToCheck = resdident.personalCode;
    this.houseService.doesResidentExistByNumber(houseNumberToCheck, resdident.apartmentId).subscribe((exists) => {
      if (exists) {
        this.houseService.UpdateResident(this.residentdetails.id, this.residentdetails).subscribe(() => {
        });
      } else if (!exists && this.isManager) {
        this.houseService.CreateResident(this.residentdetails).subscribe(() => {
        });
      }
    });
    this.closeModalAndRefresh();

  }


  async Delete(resdidentid: number) {
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteResident(resdidentid)
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
  }


}
