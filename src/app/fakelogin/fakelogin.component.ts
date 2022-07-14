import { Component, OnInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-fakelogin',
  templateUrl: './fakelogin.component.html',
  styleUrls: ['./fakelogin.component.css']
})
export class FakeloginComponent implements OnInit {
  
  constructor(private sharedService:SharedService) { }
  selected = 'option2';

  ngOnInit(): void {
  }
  
  logginWith(selected: any): void {
    console.log(selected);
    this.sharedService.sendClickLoginEvent(selected);
  }
}
