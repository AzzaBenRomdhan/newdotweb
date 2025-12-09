import { Component, OnInit } from '@angular/core';
import { HistoryService, UserHistory } from 'app/services/history/history.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  histories: UserHistory[] = [];
  paginatedHistories: UserHistory[] = []; // 👈 données affichées dans la table

  searchValue = '';

  // Pagination
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20, 50];
  isLoading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadAllHistory();
  }

  loadAllHistory() {
    this.isLoading = true;
    this.historyService.getAllHistory().subscribe({
      next: (data: UserHistory[]) => {
        this.histories = data.reverse();
        this.updatePagination();
        this.isLoading=false
      },
      error: () => {
        this.histories = [];
        this.paginatedHistories = [];
        this.isLoading=false;
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
        this.currentPage = 0; // reset page
        this.updatePagination();
      },
      error: () => {
        this.histories = [];
        this.paginatedHistories = [];
      }
    });
  }

  // 🔥 Mise à jour des données paginées
  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedHistories = this.histories.slice(startIndex, endIndex);
  }

  // 🔥 Événement de changement de page
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }
}
