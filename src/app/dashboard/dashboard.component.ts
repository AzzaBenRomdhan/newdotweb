import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { DashboardService, DocumentStats } from 'app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  passportCount: number = 0;
  idCount: number = 0;
  chartData: any;
  chartOptions: any;
  constructor(private dashboardService: DashboardService) { }
 
  ngOnInit() {

    this.loadCounts();
    this.loadChart();
      
  }
 loadCounts() {
    this.dashboardService.getDocumentCounts().subscribe(res => {
      this.passportCount = res.passportCount;
      this.idCount = res.idCount;
    });
  }

  loadChart() {
    this.dashboardService.getDocumentStats().subscribe((data: DocumentStats[]) => {
      const labels = data.map(d => d.date);
      const series = [data.map(d => d.count)];

      this.chartData = {
        labels: labels,
        series: series
      };

      this.chartOptions = {
        axisX: {
          showGrid: true
        },
        axisY: {
          onlyInteger: true,
          offset: 50
        },
        low: 0,
        showArea: true
      };

      // Créer le chart après que le DOM est prêt et les données chargées
      setTimeout(() => {
        new Chartist.Line('#chart', this.chartData, this.chartOptions);
      }, 0);
    });
  }
}
