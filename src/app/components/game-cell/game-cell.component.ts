import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CellModel } from 'src/app/common/CellModel';

@Component({
  selector: 'app-game-cell',
  templateUrl: './game-cell.component.html',
  styleUrls: ['./game-cell.component.scss']
})
export class GameCellComponent implements OnInit {

  private _cellDataModel: CellModel;

  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
  
  // life cycle plumbing

  ngOnInit(): void {
  }

  // event handlers

  handleClick = (e: Event, isRightClick: boolean): void => {
    e.stopPropagation();
    e.preventDefault();
    this.click.emit(isRightClick);
  }

  // properties

  @Input() set CellDataModel(value: CellModel) {
    this._cellDataModel = value;
  }
  get CellDataModel(): CellModel {
    return this._cellDataModel;
  }

} // class
