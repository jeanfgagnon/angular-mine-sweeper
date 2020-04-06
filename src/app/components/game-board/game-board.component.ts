import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';
import { CellClickPayload } from 'src/app/common/CellClickPayload';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  private _gameOption: GameOption;
  private _board: CellModel[];

  rowArray: number[];
  colArray: number[];

  @Output() cellClick: EventEmitter<CellClickPayload> = new EventEmitter<CellClickPayload>();

  constructor() { 
  }
  
  // life cycle plumbing
  
  ngOnInit(): void {
    // those two arrays are used only to loop tr & td in template.
    this.initBoardArray();
  }

  // event handlers

  onCellClicked = (ccp: CellClickPayload) : void => {
    this.cellClick.emit(ccp); 
  }

  // helpers

  getCell = (rowNo: number, colNo: number): CellModel => {
    const index = (rowNo * this.GameOption.NbCol) + colNo;
    return this.Board[index];
  }

  // privates 

  private initBoardArray(): void {
    this.rowArray = Array<number>(this.GameOption.NbRow).fill(0).map((x, i) => i);
    this.colArray = Array<number>(this.GameOption.NbCol).fill(0).map((x, i) => i);
  }

  // properties

  @Input() set Board(value: CellModel[]) {
    this._board = value;
  }
  get Board(): CellModel[] {
    return this._board;
  }

  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
    this.initBoardArray();
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

} // class
