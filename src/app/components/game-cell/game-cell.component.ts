import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CellModel } from 'src/app/common/CellModel';
import { CellClickPayload } from 'src/app/common/CellClickPayload';

@Component({
  selector: 'app-game-cell',
  templateUrl: './game-cell.component.html',
  styleUrls: ['./game-cell.component.scss']
})
export class GameCellComponent {

  private _cellDataModel: CellModel;

  @Output() cellClick: EventEmitter<CellClickPayload> = new EventEmitter<CellClickPayload>();

  constructor() { }
  
  // life cycle plumbing

  // event handlers

  public handleClick = (e: Event, isRightClick: boolean): void => {
    const ccp = new CellClickPayload();
    ccp.BoardIndex = this.CellDataModel.CellNo;
    ccp.IsRightClick =  isRightClick;
 
    e.stopPropagation();
    e.preventDefault();
    this.cellClick.emit(ccp);
  }

  // properties

  @Input() set CellDataModel(value: CellModel) {
    this._cellDataModel = value;
  }
  get CellDataModel(): CellModel {
    return this._cellDataModel;
  }

} // class
