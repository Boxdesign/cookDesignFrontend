import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from "../article.service";
import { CompassService } from '../../../global-utils/services/compass.service'
import { Subject } from 'rxjs'
import { ConfirmationService } from 'primeng/primeng'
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'article-tab',
  templateUrl: './article-tab.component.html',
  styleUrls: ['./article-tab.component.scss']
})
export class ArticleTabComponent implements OnInit {
  public mode;
  public tab;
  public id;
  public article;
  public redirectData;
  public redirectOn: boolean = false;
  public deactivate: Subject<boolean> = new Subject();
  public alertHeader;
  public alertMessage;

  constructor(
  	public route: ActivatedRoute, 
  	public compassService: CompassService, 
  	public router: Router, 
  	public articleService: ArticleService,
    public confirmationService: ConfirmationService, 
    public translate: TranslateService
  ) {}

  ngOnInit() {
    //Get tab if provided
    this.route.params.subscribe(params => {this.id=params['id']; this.tab=params['tab'];});
    this.redirectData = this.compassService.getRedirectData();
    //Get mode from route path
    this.route.data.subscribe((data: {mode: string}) => {
      if(data.mode) this.mode = data.mode;
    });   

    this.translation();
    this.getArticle()
  }

  public translation(){
    this.translate.get('messageGeneric.alert').subscribe((res: string) => {
      this.alertHeader = res;
    });  

    this.translate.get('messageGeneric.alertMessage').subscribe((res: string) => {
      this.alertMessage = res;
    }); 
  }

  public getArticle() {
    this.articleService.getArticle(this.id).subscribe(
      (data) => {
        this.article = data;
    })
  }

  canDeactivate(): Subject<boolean> | boolean {

    if (this.mode == 'view') {
      //Delete redirect data when the user cancel the route thread
      if(!this.redirectOn) {
        this.compassService.deleteRedirectData();
      }
      return true;
    }

    this.confirmAction();
    return this.deactivate;
  }

  public setRedirectOn(e){
  	this.redirectOn=true;
  }

  public confirmAction() {
    this.confirmationService.confirm({
        header: this.alertHeader,
        message: this.alertMessage,
        icon: "fa fa-exclamation-triangle",
        accept: () => {
          this.deactivate.next(true);
        },
        reject: () => {
          this.deactivate.next(false);
        }      
      });
  }
  public redirect() {
    if(this.redirectData && this.redirectData.activated) { //user came from articles tab in providers, need to redirect back to providers
      let _id = this.redirectData.id;
      let _versionId = this.redirectData.versionId;
      let mode = this.redirectData.mode;
      let originPath = this.redirectData.originPath;
      //No delete redirect data
      //Reset redirect data.
      this.compassService.resetRedirectData();
      if (_id == null) {
        this.router.navigate(['./' + originPath]);
      } else {
        if (mode == 'edit') {
          this.router.navigate(['./' + originPath + '/edit', _id, {versionId: _versionId, tab: 'menu'}]);
        } else {
          this.router.navigate(['./' + originPath + '/', _id, {versionId: _versionId, tab: 'menu'}]);
        }
      }
      } else { //user came from recipes
        this.router.navigate(['./providers/article/']);
      }
  }


  public editArticle() {
  	this.redirectOn=true;
    this.router.navigate(['./providers/article/edit/',this.id]);
  }
}
