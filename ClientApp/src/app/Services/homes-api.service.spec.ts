import { TestBed } from '@angular/core/testing';

import { HomesApiService } from './homes-api.service';

describe('HomesApiService', () => {
  let service: HomesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomesApiService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});
