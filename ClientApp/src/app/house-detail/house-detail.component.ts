import { House } from './../Models/house.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomesApiService } from '..//Services/homes-api.service';
import { Apartment } from '../Models/apartment.model';
import { Injectable } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { HouseEditComponent } from '../ModalLogs/house-edit/house-edit.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../ModalLogs/delete-confirmation-modal/delete-confirmation-modal.component';
import { ApartmentEditComponent } from '../ModalLogs/apartment-edit/apartment-edit.component';
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
  houseId: number | undefined;
  isManager: boolean = false;
  isResident: boolean = false;
  apartmentId: number | undefined;
  house: House | undefined;
  apartments: Apartment[] | undefined;
  showEditForm: boolean | undefined;
  selectedHouse: number = 0;
  housesselector: House[] = [];
  housedetails: House = {
    id: 0,
    number: 0,
    street: '',
    city: '',
    country: '',
    postcode: '',
  }

  constructor(
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HomesApiService,
    private AuthorizeService: AuthorizeService,

  ) { }
  ngOnInit(): void {
    this.manager();
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
    this.getHousesSelectorData();
  }

  private getHousesSelectorData() {

    this.houseService.getAllHouses().subscribe((data: House[]) => {
      this.housesselector = data;
    });
  }
  onSelected(selectedHouse: number) {
    this.router.navigate(['house', selectedHouse]);
  }
  getHouseDetails(houseId: number) {
    return this.houseService.getHouseById(houseId);
  }

  openEditModal(houseId: number) {
    const modalRef = this.modalService.open(HouseEditComponent);
    modalRef.componentInstance.houseId = houseId;
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


}
