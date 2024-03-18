import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/utils/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.setAddCustomerVisibility(false);
  }

}
