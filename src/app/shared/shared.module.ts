import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { FireServiceDb } from './services/firestoreDatabase.service';


const COMPONENTS: any[] = [
  MapComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,

  ],
  declarations: [COMPONENTS],
  exports: [...COMPONENTS, CommonModule],
  providers: [FireServiceDb]
})
export class SharedModule { }
