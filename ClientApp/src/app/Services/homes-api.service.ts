import { Resident } from './../Models/resident.model';
import { Apartment } from './../Models/apartment.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { House } from '../Models/house.model';
@Injectable({
  providedIn: 'root', // Or specify a module if needed
})
export class HomesApiService {

   private apiUrl= 'https://localhost:7281/api'

  constructor(private http: HttpClient) {}

  getAllHouses(): Observable<House[]> {
    return this.http.get<House[]>(`${this.apiUrl}/houses`);
  }

  getHouseById(id: number): Observable<House> {
    return this.http.get<House>(`${this.apiUrl}/houses/${id}`);
  }
  getAllApartments(): Observable<Apartment> {
    return this.http.get<Apartment>(`${this.apiUrl}/apartments`);
  }
  
  GetHouseApartments(houseId: number): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${this.apiUrl}/houses/${houseId}/apartments`);
  }
  UpdateHouse(id: number, house: House): Observable<any> {
    return this.http.put(`${this.apiUrl}/houses/${id}`, house);
  }
  UpdateApartment(id: number, apartment: Apartment): Observable<any> {
    return this.http.put(`${this.apiUrl}/apartments/${id}`, apartment);
  }
  GetApartmentById(id: number):Observable<Apartment>{
    return this.http.get<Apartment>(`${this.apiUrl}/apartments/${id}`);

  }
  GetApartmentsResident(apartmentId:number):Observable<Resident[]>{
    return this.http.get<Resident[]>(`${this.apiUrl}/apartments/${apartmentId}/residents`);
  }
  DeleteHouse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/houses/${id}`);
  }
  DeleteApartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/apartments/${id}`);
  }
  CreateApartment(apartmentcreate: Apartment):Observable<Apartment>{
    apartmentcreate.id=0;
    return this.http.post<Apartment>(this.apiUrl+'/apartments',apartmentcreate);
  }
  CreateHouse(housecreate: House):Observable<House>{
    housecreate.id=0;
    return this.http.post<House>(this.apiUrl+'/houses',housecreate);
  }
  GetResidentById(id: number): Observable<Resident> {
    return this.http.get<Resident>(`${this.apiUrl}/residents/${id}`);
  }
  DeleteResident(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/residents/${id}`);
  }
  UpdateResident(id: number, resident: Resident): Observable<any> {
    return this.http.put(`${this.apiUrl}/residents/${id}`, resident);
  }
  CreateResident(residentcreate: Resident):Observable<Resident>{
    residentcreate.id=0;
    return this.http.post<Resident>(this.apiUrl+'/residents',residentcreate);
  }
  doesHouseExistByNumber(houseNumber: number): Observable<boolean> {
    return this.getAllHouses().pipe(map((houses) => houses.some((house) => house.number === houseNumber))
    );
  }
  doesApartmentExistByNumber(apartmentNumber: number,houseId:number): Observable<boolean> {
    return this.GetHouseApartments(houseId).pipe(map((apartment) => apartment.some((apartment) => apartment.number === apartmentNumber))
    );
  }
  doesResidentExistByNumber(personalcode: string,apartmentNumber:number): Observable<boolean> {
    return this.GetApartmentsResident(apartmentNumber).pipe(map((resdident) => resdident.some((resdident) => resdident.personalCode === personalcode))
    );
  }
}
