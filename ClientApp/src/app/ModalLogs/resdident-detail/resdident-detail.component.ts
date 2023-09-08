import { Resident } from '../../Models/resident.model';
import { Component, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HomesApiService } from '../../Services/homes-api.service';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-resdident-detail',
  templateUrl: './resdident-detail.component.html',
  styleUrls: ['./resdident-detail.component.css']
})
export class ResdidentDetailComponent {
  
  @Input() residentId: number | undefined;
  residents: Resident[] =[]; 
  showEditModal: boolean = false;
  modalRef!: NgbModalRef;
  residentdetails:Resident={
    id: 0,
    name: '',
    surname: '',
    personalCode: '',
    dateOfBirth: new Date(2000,0,1),
    phone: '',
    email: '',
    isOwner: false,
    apartmentId: 0
  }
  public closeEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    
    public activeModal: NgbActiveModal,
    private router: Router,
    private modalService: NgbModal,
    private houseService: HomesApiService,
  ) {}

  ngOnInit(): void {
    if (this.residentId) {
      this.getResidentDetails(this.residentId).subscribe({
        next: (response: Resident) => {
          this.residentdetails = response;
        }
      });
    };
    
  }
  getResidentDetails(residentId: number) {
    console.log(residentId)
    return this.houseService.GetResidentById(residentId);
  }




  
  checkAndUpdateHouse(resdident: Resident) {
    const houseNumberToCheck = resdident.personalCode;
    this.houseService.doesResidentExistByNumber(houseNumberToCheck,resdident.apartmentId).subscribe((exists) => {
      if (exists) {
        this.houseService.UpdateResident(this.residentdetails.id, this.residentdetails).subscribe({
          next: (response) => {
            this.closeModalAndRefresh();
          }
        });
      } else {
        this.houseService.CreateResident(this.residentdetails).subscribe({
          next: (createdHouse) => {
            this.closeModalAndRefresh();
          }
        });
      }
  
      this.closeModalAndRefresh();
    });
  }


   async Delete(resdidentid: number) {
    const result = this.openConfirmationModal();
    if (await result) {
      this.deleteResident(resdidentid)
    } else {
    }
  }
  deleteResident(residentId: number){
    this.houseService.DeleteResident(residentId).subscribe({
      next:(response)=>{
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



  closeModalAndRefresh() {
    this.activeModal.close();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(['apartments/'+this.residentdetails.apartmentId+'/residents']))
  }

  


}