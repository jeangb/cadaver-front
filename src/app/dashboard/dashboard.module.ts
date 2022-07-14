import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent, DialogContentExampleDialog } from './dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatInputModule } from '@angular/material/input';
import { HistoryComponent } from '../history/history.component';
import { InprogressComponent } from '../inprogress/inprogress.component';
import { CurrentphraseComponent } from '../currentphrase/currentphrase.component';
import { RandomgeneratorComponent } from '../randomgenerator/randomgenerator.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DashboardComponent,
    HistoryComponent,
    InprogressComponent,
    CurrentphraseComponent,
    RandomgeneratorComponent,
    DialogContentExampleDialog
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    FormsModule
  ]
})
export class DashboardModule { }