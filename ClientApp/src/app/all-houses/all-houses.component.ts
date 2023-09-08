import { Component } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';
import { HouseEditComponent } from '../ModalLogs/house-edit/house-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {
  

  houses: House[]=[];
    constructor(private houseService: HomesApiService,
    public modalService:NgbModal
  ) { }
  ngOnInit(): void {
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
}