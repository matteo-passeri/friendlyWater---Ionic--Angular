import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { Tab1PageModule } from './1chat/tab1.module';
import { Tab2PageModule } from './2map/tab2.module';
import { Tab3PageModule } from './3addMarker/tab3.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    Tab1PageModule,
    Tab2PageModule,
    Tab3PageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
