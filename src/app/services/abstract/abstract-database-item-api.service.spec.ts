import { TestBed } from '@angular/core/testing';

import { AbstractDatabaseItemApiService } from './abstract-database-item-api.service';

describe('AbstractDatabaseItemApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbstractDatabaseItemApiService = TestBed.get(AbstractDatabaseItemApiService);
    expect(service).toBeTruthy();
  });
});
