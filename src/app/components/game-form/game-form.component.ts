import { Component, OnInit, Input } from '@angular/core';

import { GameOption } from 'src/app/common/GameOption';
import { CellModel } from 'src/app/common/CellModel';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  private _gameOption: GameOption;

  board: CellModel[] = [];
  flagCount = 0;
  elapsed = 0;
  gameOver = false;

  constructor() { }

  // life cycle plumbing

  ngOnInit(): void {
    this.initBoard();
  }

  // event handlers

  onToggleConfigClick = (): void => {
    console.log('on toggle la config de mes deuces');
  }

  onRestartClick = (): void => {
    console.log('on restart le jeu');
  }

  // helpers

  formWidth = (): number => {
    return this.GameOption.NbCol * 27 + 10;
  }

  // private code

  // initialize the game 'logic' board as an array
  private initBoard = (): void => {
    this.board = [];
    let index = 0;
    for (let rowNo = 0; rowNo < this.GameOption.NbRow; rowNo++) {
      for (let colNo = 0; colNo < this.GameOption.NbCol; colNo++) {
        const cell = this.createCellModel(index, rowNo, colNo);
        this.board.push(cell);
        index++;
      }
    }
  } // initBoard

  // create and initialize one board cell
  private createCellModel(index: number, rowNo: number, colNo: number): CellModel {
    const cell = new CellModel();

    cell.CellId = `cell_${rowNo + 1}_${colNo + 1}`;
    cell.CellNo = index;
    cell.IsRedFlagVisible = false;
    cell.IsBomb = false;
    cell.IsCleared = false;
    cell.Text = '';
    cell.CssClass = 'cellUnclick'

    return cell;
  } // createCellModel

  // properties 

  @Input() set GameOption(value: GameOption) {
    this._gameOption = value;
  }
  get GameOption(): GameOption {
    return this._gameOption;
  }

} // class
