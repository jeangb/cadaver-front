import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InprogressComponent } from './inprogress/inprogress.component';
import { CurrentphraseComponent } from './currentphrase/currentphrase.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FakeloginComponent } from './fakelogin/fakelogin.component'



@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    InprogressComponent,
    CurrentphraseComponent,
    FakeloginComponent
  ],
  imports: [
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
