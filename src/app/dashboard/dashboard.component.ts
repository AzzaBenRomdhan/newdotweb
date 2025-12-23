import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Chartist from 'chartist';
import { DashboardService, DocumentStats, DocumentStatsMonth } from 'app/services/dashboard/dashboard.service';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { DocumentService } from 'app/services/documents/documents.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  
  passportCount: number = 0;
  idCount: number = 0;
  chartData: any;
  chartOptions: any;
  
  // Variables pour le nouveau graphique Chart.js
  @ViewChild('monthlyChartCanvas', { static: false }) monthlyChartCanvas!: ElementRef<HTMLCanvasElement>;
   monthlyChart: Chart | null = null;
  private monthlyStatsSubscription: Subscription | null = null;
  monthlyStatsData: DocumentStatsMonth[] = [];
  isLoadingMonthlyStats: boolean = false;
  isChartReady: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private documentService: DocumentService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadCounts();
    this.loadChart();
    this.loadMonthlyStats();
  }

  ngAfterViewInit() {
    // S'assurer que le canvas est disponible après l'initialisation de la vue
    setTimeout(() => {
      this.isChartReady = true;
      if (this.monthlyStatsData.length > 0 && this.monthlyChartCanvas) {
        this.createMonthlyChart();
      }
    }, 100);
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

      setTimeout(() => {
        new Chartist.Line('#chart', this.chartData, this.chartOptions);
      }, 0);
    });
  }

  loadMonthlyStats(): void {
    this.isLoadingMonthlyStats = true;
    
    this.monthlyStatsSubscription = this.dashboardService.getDocumentStatsPrMonth().subscribe({
      next: (data: DocumentStatsMonth[]) => {
        this.monthlyStatsData = data;
        this.isLoadingMonthlyStats = false;
        
        // Attendre que le canvas soit disponible
        setTimeout(() => {
          if (this.isChartReady && data.length > 0) {
            this.createMonthlyChart();
          }
        }, 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques mensuelles:', error);
        this.isLoadingMonthlyStats = false;
      }
    });
  }

  createMonthlyChart(): void {
    // Vérifier que le canvas est disponible
    if (!this.monthlyChartCanvas?.nativeElement) {
      console.error('Canvas non disponible');
      return;
    }

    // Détruire l'ancien graphique s'il existe
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    // Préparer les données
    const data = this.monthlyStatsData;
    const months = [...new Set(data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`))].sort();
    const documentTypes = [...new Set(data.map(item => item.typeDoc))];
    
    console.log('Données reçues:', data);
    console.log('Mois:', months);
    console.log('Types de documents:', documentTypes);

    // Préparer les datasets pour chaque type de document
    const datasets = documentTypes.map(typeDoc => {
      const counts = months.map(month => {
        const [year, monthNum] = month.split('-');
        const stat = data.find(item => 
          item.year === parseInt(year) && 
          item.month === parseInt(monthNum) && 
          item.typeDoc === typeDoc
        );
        return stat ? stat.count : 0;
      });

      console.log(`Dataset pour ${typeDoc}:`, counts);

      const colors = this.getColorForType(typeDoc);

      return {
        label: this.getTypeDocLabel(typeDoc),
        data: counts,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 2,
        fill: false,
        tension: 0.1
      };
    });

    // Formater les labels des mois
    const monthLabels = months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });

    console.log('Labels des mois:', monthLabels);
    console.log('Datasets:', datasets);

    // Configuration du graphique
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#495057',
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Statistiques mensuelles par type de document',
            color: '#495057',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#6c757d'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#6c757d'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    };

    try {
      const ctx = this.monthlyChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.monthlyChart = new Chart(ctx, config);
        console.log('Graphique créé avec succès');
      } else {
        console.error('Impossible de récupérer le contexte du canvas');
      }
    } catch (error) {
      console.error('Erreur lors de la création du graphique:', error);
    }
  }

  getTypeDocLabel(typeDoc: string): string {
    const labels: { [key: string]: string } = {
      'ID': 'Carte ID',
      'P': 'Passeport'
    };
    return labels[typeDoc] || typeDoc;
  }

  getColorForType(typeDoc: string): { backgroundColor: string, borderColor: string } {
    const colors: { [key: string]: { backgroundColor: string, borderColor: string } } = {
      'ID': { 
        backgroundColor: '#2ecc71', 
        borderColor: '#2ecc71' 
      },
      'P': { 
        backgroundColor: '#27325e', 
        borderColor: '#27325e' 
      }
    };
    return colors[typeDoc] || { 
      backgroundColor: 'rgba(108, 117, 125, 0.7)', 
      borderColor: 'rgba(108, 117, 125, 1)' 
    };
  }

  ngOnDestroy(): void {
    if (this.monthlyStatsSubscription) {
      this.monthlyStatsSubscription.unsubscribe();
    }
    
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
  }
}