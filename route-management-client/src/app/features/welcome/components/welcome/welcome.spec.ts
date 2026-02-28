import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Welcome } from './welcome';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatIconModule,
        MatButtonModule,
        MatDividerModule
      ],
      declarations: [Welcome],
    }).compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have four features listed', () => {
    expect(component.features.length).toBe(4);
  });
});