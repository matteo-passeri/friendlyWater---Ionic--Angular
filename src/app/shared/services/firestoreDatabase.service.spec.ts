import { TestBed } from '@angular/core/testing';

import { FireServiceDb } from './firestoreDatabase.service';

describe('FireService', () => {
  let service: FireServiceDb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireServiceDb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
