import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubViewComponent } from './github-view.component';

describe('GithubViewComponent', () => {
  let component: GithubViewComponent;
  let fixture: ComponentFixture<GithubViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GithubViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
