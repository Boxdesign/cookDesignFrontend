import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service'
import { BrowserXhr  } from '@angular/http';
import * as FileSaver from "file-saver";
import { GastroOfferService } from "../../gastro/gastro-offers/gastro-offer.service";
import { FamilyService } from "../../libraries/family/family.service";
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {

  public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  };

  constructor() { 

  }

  ngOnInit() {
  }

  
}
