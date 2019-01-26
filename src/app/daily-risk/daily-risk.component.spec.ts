import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRiskComponent } from './daily-risk.component';

describe('DailyRiskComponent', () => {
  let component: DailyRiskComponent;
  let fixture: ComponentFixture<DailyRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
