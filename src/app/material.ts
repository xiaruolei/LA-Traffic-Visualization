import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';

@NgModule({
  imports:[ MatToolbarModule,
          MatIconModule,
          MatSelectModule,
          MatButtonModule ],
  exports:[ MatToolbarModule,
          MatIconModule,
          MatSelectModule,
          MatButtonModule],
})

export class MaterialModule{}
