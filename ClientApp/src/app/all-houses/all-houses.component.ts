import { Component } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';
import { HouseEditComponent } from '../ModalLogs/house-edit/house-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {
  filteredHouses: House[] = [];
  filterValue = '';
  houses: House[] = [];
  isManager: boolean = false;
  isResident: boolean = false;
  filterInput$: Subject<string> = new Subject<string>();

  constructor(private houseService: HomesApiService,
    public modalService: NgbModal,
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
  openEditModalEditHouse(houseId: number) {
    const modalRef = this.modalService.open(HouseEditComponent);
    modalRef.componentInstance.houseId = houseId;
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