import { Component, OnInit } from '@angular/core';
import { CompassService } from '../../global-utils/services/compass.service'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'report-tab',
  templateUrl: './report-tab.component.html',
  styleUrls: ['./report-tab.component.css']
})
export class ReportTabComponent implements OnInit {
  public redirectData;


	public options = {
   	timeOut: 1500,
    position: ["top", "right"]
  }
  
  constructor(public compassService: CompassService, public router: Router) { }

  ngOnInit() {
    this.redirectData = this.compassService.getRedirectData();  

  }

  public redirect() {

    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      
      //Reset redirect data.
      this.compassService.resetRedirectData();


      if (mode == 'edit') {
        this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
      } else if (this.redirectData.mode == 'view') {
        this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
      }
     } 
  }

}
