import { TestBed } from '@angular/core/testing';

import { FileHandleService } from './file-handle.service';

describe('FileHandleService', () => {
  let service: FileHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
