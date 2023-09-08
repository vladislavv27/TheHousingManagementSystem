import { Component } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';
import { HouseEditComponent } from '../ModalLogs/house-edit/house-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {
  

  houses: House[]=[];
  isManager: boolean = false;
  isResident: boolean = false;

    constructor(private houseService: HomesApiService,
    public modalService:NgbModal,
    private AuthorizeService: AuthorizeService,

  ) { }
  ngOnInit(): void {
    this.manager();
    this.getHouses();
  }

  getHouses() {
    this.houseService.getAllHouses().subscribe(
      (houses: House[]) => {
        this.houses = houses;
        console.log(this.houses); 
      }
    );
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