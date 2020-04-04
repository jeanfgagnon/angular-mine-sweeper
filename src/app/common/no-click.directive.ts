import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoClick]'
})
export class NoClickDirective {

  @HostListener('click', ['$event'])
  onLeftClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  constructor() { }

}
