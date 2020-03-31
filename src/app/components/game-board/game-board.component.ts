import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';

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

  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { 
  }
  
  // life cycle plumbing
  
  ngOnInit(): void {
    // those two arrays are used only to loop tr & td in template.
    this.rowArray = Array<number>(this.GameOption.NbRow).fill(0).map((x, i) => i);
    this.colArray = Array<number>(this.GameOption.NbCol).fill(0).map((x, i) => i);
  }

  // event handlers

  onCellClicked = (isRightClick: boolean) : void => {
    this.click.emit(isRightClick); 
  }

  // helpers

  getCell = (rowNo: number, colNo: number): CellModel => {
    const index = (rowNo * this.GameOption.NbCol) + colNo;
    return this.Board[index];
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
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

} // class
