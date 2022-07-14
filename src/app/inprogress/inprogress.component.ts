import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { SharedService } from './../services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';


export interface IInprogressArray {
  id: string;
  auteurs: string;
  progress: string;
  remaining: string;
}

@Component({
  selector: 'app-inprogress',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.css']
})
export class InprogressComponent implements OnInit {

  phraseData: any;
  dataSource : any;
  displayedColumns = ['id', 'auteurs', 'progress', 'remainingWords'];
  clickedRows = new Set<IInprogressArray>();

  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  constructor(private http: HttpClient,private sharedService:SharedService) { }

  joinPhrase(idPhrase: string): void {
    
    console.log('joined '+idPhrase);
    this.sharedService.sendClickPhraseEvent(idPhrase);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IInprogressArray>();
    this.http.get(`${environment.apiUrl}/api/phrases?full=false`)
    .subscribe(data => {
      // Assign the data to the data source for the table to render
      this.phraseData=data;
    

    this.phraseData.forEach((element: IPhrase) => {
      let myData = new Array<string>();
      let wordsInPhrase =new Array<string>();
      let wordsRemainInPhrase =new Array<string>();

      if (null !=element.subject) {
        myData.push(element.subject.user.login);
        wordsInPhrase.push('Sujet');
      } else {
        wordsRemainInPhrase.push('Sujet');
      }
      if (null !=element.verb) {
        myData.push(element.verb.user.login);
        wordsInPhrase.push('Verbe');
      }else{
        wordsRemainInPhrase.push('Verbe');
      }
      if (null !=element.directObject) {
        myData.push(element.directObject.user.login);
        wordsInPhrase.push('Complément d\'Objet Direct');
      } else {
        wordsRemainInPhrase.push('Complément d\'Objet Direct');
      }
      if (null !=element.circumstantialObject) {
        myData.push(element.circumstantialObject.user.login);
        wordsInPhrase.push('Complément d\'Objet Circonstantiel.');
      }else{
        wordsRemainInPhrase.push('Complément d\'Objet Circonstantiel.');
      }
      
      const distinctArray = myData.filter((n, i) => myData.indexOf(n) === i);

      let model = { 'id': element.id, 'auteurs': distinctArray.join(", "), 'progress': wordsInPhrase.join(", "), 'remainingWords': wordsRemainInPhrase.join(", "), 'join': 5 };  //get the model from the form
      this.dataSource.data.push(model);  
      this.dataSource.sort = this.sort;
    });
    })

  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  

}


