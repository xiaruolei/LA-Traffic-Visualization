import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerRatioComponent } from './danger-ratio.component';

describe('DangerRatioComponent', () => {
  let component: DangerRatioComponent;
  let fixture: ComponentFixture<DangerRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangerRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
