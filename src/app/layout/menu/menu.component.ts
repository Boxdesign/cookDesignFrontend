import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../global-utils/services/auth.service';
import { SessionService } from '../../global-utils/services/session.service';
import { AppConfig } from "../../global-utils/services/appConfig.service";

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss']
})
export class MenuComponent implements OnInit {

	public isAdmin;
  public isSelentaModule = false;
  public showSideBar:boolean;

  @Output() showSideBarMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
  	public authService: AuthService, 
  	public sessionService: SessionService,
		public appConfig: AppConfig
  ) 
  {}

  ngOnInit() {
  	this.sessionService.isAdmin().subscribe((value) => {
  		this.isAdmin = value;
      this.showSideBar = this.sessionService.showSideBarMenu;
      this.showSideBarMenu.emit(this.sessionService.showSideBarMenu);
  	});

  	this.appConfig.getOrganization().subscribe((name) => {
  		if(name == 'Oilmotion') this.isSelentaModule= true;
  	})

  }

  showHideSideBarMenu(){
    if(this.showSideBar) {
      this.showSideBarMenu.emit(false);
      this.showSideBar = false;
      this.sessionService.showSideBarMenu = false;
    }else{
      this.showSideBarMenu.emit(true);
      this.showSideBar = true;
      this.sessionService.showSideBarMenu = true;

    }
  }

}
