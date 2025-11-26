import { Component, OnInit } from '@angular/core';
import { HistoryService, UserHistory } from 'app/services/history/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  histories: UserHistory[] = [];  
  searchValue = '';

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadAllHistory();
  }

  loadAllHistory() {
    this.historyService.getAllHistory().subscribe({
      next: (data: UserHistory[]) => {
        this.histories = data.reverse();
      },
      error: () => {
        this.histories = [];
      }
    });
  }

  search() {
    if (!this.searchValue) {
      this.loadAllHistory();
      return;
    }

    this.historyService.getUserHistory(this.searchValue).subscribe({
      next: (data: UserHistory[]) => {
        this.histories = data;
      },
      error: () => {
        this.histories = [];
      }
    });
  }
}