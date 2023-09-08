import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {

  constructor(    
    public modalService:NgbModal,
    private router:Router, 
    public activeModal: NgbActiveModal,
) {}

confirm() {
  this.activeModal.close(true); 
}

cancel() {
  this.activeModal.close(false);
}
}