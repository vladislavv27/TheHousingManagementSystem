import { Component } from '@angular/core';
import { House } from '../Models/house.model';
import { HomesApiService } from '../Services/homes-api.service';

@Component({
  selector: 'app-all-houses',
  templateUrl: './all-houses.component.html',
  styleUrls: ['./all-houses.component.css']
})
export class AllHousesComponent {

  houses: House[]=[];
  constructor(private houseService: HomesApiService) { }
  ngOnInit(): void {
    this.getHouses();
  }

  getHouses() {
    this.houseService.getAllHouses().subscribe(
      (houses: House[]) => {
        this.houses = houses;
        console.log(this.houses); 
      },
      (error) => {
        console.error(error);
      }
    );
  }
}