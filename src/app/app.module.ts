import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import { GameHeaderComponent } from './components/game-header/game-header.component';
import { GameConfigComponent } from './components/game-config/game-config.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameCellComponent } from './components/game-cell/game-cell.component';
import { NoRightClickDirective } from './common/no-right-click.directive';
import { NoClickDirective } from './common/no-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    GameFormComponent,
    GameHeaderComponent,
    GameConfigComponent,
    GameBoardComponent,
    GameCellComponent,
    NoRightClickDirective,
    NoClickDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
