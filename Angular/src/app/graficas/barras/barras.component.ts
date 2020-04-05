import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-barras',
  templateUrl: './barras.component.html',
  styleUrls: ['./barras.component.css']
})
export class BarrasComponent implements OnInit {

 
  public barChartOptions: ChartOptions = {
    responsive: true,
   
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Sabor de los cerebros'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  

  public barChartData: ChartDataSets[] = [
    { data: [65], label: 'Melon' },
    { data: [28], label: 'Sandia  ' },
    { data: [28], label: 'Fresa' }
  ];

 
  public barChartOptions2: ChartOptions = {
    responsive: true,
    
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels2: Label[] = ['Usuario que registro los cerebros'];
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartPlugins2 = [pluginDataLabels];
  

  public barChartData2: ChartDataSets[] = [
    { data: [65], label: 'Pedro' },
    { data: [28], label: 'Omar' },
    { data: [28], label: 'Mario' }
  ];

  constructor(private _dataService: DataService) { }



  ngOnInit() {
        this.actualizarPorSabor();
        this.actualizarPorUsuario();
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public actualizarPorSabor(): void {
    
    this._dataService.graficaCerebros().subscribe((resultado) => {
           console.log(resultado);

           let list: ChartDataSets[] = [];
           let listCant: number[] = [];
           let listTitulo: string[] = [];

           for (let key in resultado) {

           
            this._dataService.cuentaCerebros(resultado[key]).subscribe((resultado2) => {
              
                    list.push({data: [Object.keys(resultado2).length], label:resultado[key], backgroundColor: 
                        "rgba("+Math.round(Math.random() * 200)+","+Math.round(Math.random() * 200)+","+Math.round(Math.random() * 200)+",1)"});
                   
 
              }, (error) => {
                    console.log(error);
              });
              
            }
            console.log(list);
          this.barChartData = list;

    }, (error) => {
           console.log(error);
    });
  }

  public actualizarPorUsuario(): void {
    
    this._dataService.graficaUsuarios().subscribe((resultado) => {
           let list: ChartDataSets[] = [];
      
           for (let key in resultado) {

    
            this._dataService.cuentaPorUsuario(resultado[key]).subscribe((resultado2) => {

                        this._dataService.traeUsuario(resultado[key]).subscribe((nombre) => {
                         console.log(nombre);

                         list.push({data: [Object.keys(resultado2).length], label: JSON.stringify(nombre), backgroundColor: 
                          "rgba("+Math.round(Math.random() * 200)+","+Math.round(Math.random() * 200)+","+Math.round(Math.random() * 200)+",1)"});
  
                        },(error) => {
                            console.log(error);
                        });
              }, (error) => {
                    console.log(error);
              });
            
            } 
          this.barChartData2 = list;

    }, (error) => {
           console.log(error);
    });
  }
}
