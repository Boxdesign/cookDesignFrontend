import { Component, OnInit, Input } from '@angular/core';
import { AppReleaseService } from '../../services/appRelease.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-release',
  templateUrl: './app-release.component.html',
  styleUrls: ['./app-release.component.css']
})
export class AppReleaseComponent implements OnInit {

	@Input() refresh = new Subject()
	public appReleases;
	public releaseName;
	public appRelease;
	public mode;

  constructor(
  	public appReleaseService: AppReleaseService,
  	public translateService: TranslateService
  	) 
  { }

  ngOnInit() {

  	this.translate()
  	this.getReleases();

  	this.refresh.subscribe((data) => {
  		this.getReleases();
  	})
  }

  public translate(){

    // this.translateService.get('version').subscribe((res: string) => {
    //   this.versionLabel = res;
    // });
  }

  public viewLatestRelease(){
  	this.mode = 'detail';
  	this.appRelease = this.appReleases[0];
  }

  public backToVersionList(){
  	this.mode = 'list';
  }

  public getReleases(){

  	this.appReleaseService.getAll().subscribe(
  		(data) => {
  			this.appReleases = data;
  			//console.log(this.appReleases, 'app releases')
  			if(this.appReleases.length) this.releaseName = this.appReleases[0].name;
  			else {
  				this.releaseName = '---'
  			}
  		},
  		(err) => {
  			console.error('Error obtaining app releases')
  		})
  }

  public selectToView(appRelease){
  	this.appRelease = JSON.parse(JSON.stringify(appRelease))
  	this.mode = 'detail'
  }

}
