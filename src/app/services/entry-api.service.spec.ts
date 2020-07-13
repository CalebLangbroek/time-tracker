import { TestBed } from '@angular/core/testing';

import { EntryApiService } from './entry-api.service';

describe('EntryApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntryApiService = TestBed.get(EntryApiService);
    expect(service).toBeTruthy();
  });
});
