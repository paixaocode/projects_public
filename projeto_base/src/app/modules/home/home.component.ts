import { Component, OnInit } from '@angular/core';
import { PoSlideItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  PBItems: Array<PoSlideItem> = [
    { image: '/assets/PB/imagens/BANNER_PB_1.jpg' },
    { image: '/assets/PB/imagens/BANNER_PB_2.jpg' }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
