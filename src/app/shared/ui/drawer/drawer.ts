import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [NgClass],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss'
})
export class Drawer {
  open = input(false);
  closeEvent = output<void>();
  

  closeNav() {
    this.closeEvent.emit();
  }
}