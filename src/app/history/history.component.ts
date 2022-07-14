import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPhrase } from '../models/models.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  phraseData: any;
  dataSource : any;
  displayedColumns = ['id', 'phrase', 'auteurs'];

  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();

    this.http.get(`${environment.apiUrl}/api/phrases?full=true`)
    .subscribe(data => {
      // Assign the data to the data source for the table to render
      this.phraseData=data;
      const ids=[];
    
    this.phraseData.forEach((element: IPhrase) => {
      let myData = new Array<string>();
      myData.push(element.subject.user.login);
      myData.push(element.verb.user.login);
      myData.push(element.directObject.user.login);
      myData.push(element.circumstantialObject.user.login);
      // myData.push('TOTO');
      const distinctArray = myData.filter((n, i) => myData.indexOf(n) === i);

      let phrase= element.subject.libelle + " " + element.verb.libelle+ " "+ element.directObject.libelle +" "+element.circumstantialObject.libelle+"."

      let model = { 'id': element.id, 'phrase' : phrase, 'auteurs': distinctArray.join(", ")};  //get the model from the form
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
