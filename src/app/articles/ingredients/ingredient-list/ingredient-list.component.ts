import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientsService } from '../ingredients.service'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { NotificationsService } from 'angular2-notifications'
import { CostFilterService } from '../../../global-utils/services/cost-filter.service'
import { Subject} from "rxjs/Rx";

@Component({
  selector: 'ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit {
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public filterText: string = '';
  public sortField:string='';
  public sortOrder:number=1;
  public filterLocation;
  public searchBoxLabel: string;
  public allIngredients;
  public families;
  public ingredientDeletedTitle;
  public ingredientDeletedContent;
  public quarteringDeletedTitle;
  public quarteringDeletedContent;
  public ingredientOnEdit;
  public costLocation;
  public numPages:number;
  public loading:boolean = true;
  public updating:boolean = false;
  public active:boolean = true;
  public filterActive: boolean = false;
  public print = new Subject();  

  public notificationOptions = {
     timeOut: 1500,
    position: ["top", "right"]
  }
  public observerLocation;
  public printData;  
  public savedFilters;


  constructor(
  	public ingredientService : IngredientsService, 
  	public translate: TranslateService, 
  	public router : Router, 
    public notification : NotificationsService, 
    public costFilterService: CostFilterService
  ) {}

  ngOnInit(){
    this.loading = true;
    this.updating = false;
    this.currentPage = this.ingredientService.getCurrentPage();
    this.itemsPerPage = this.ingredientService.getItemsPerPage();
    this.filterText = this.ingredientService.getSearchFilter();
    this.savedFilters = this.ingredientService.getSavedFilters();
    ( { sortOrder: this.sortOrder, sortField: this.sortField, active: this.active, filterActive: this.filterActive } = this.savedFilters)        

    this.observerLocation = this.costFilterService.getCostLocation().subscribe(
      (data:any) => {
        this.filterLocation = data;      
        this.getIngredients();
    })

    this.translation();
    this.getIngredients();    
  }

  ngOnDestroy() {
    this.observerLocation.unsubscribe()
  }
  
  public translation(){

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

     this.translate.get('articles.ingredients.notifications.ingredientDeletedTitle').subscribe((res: string) => {
      this.ingredientDeletedTitle = res;
    });

     this.translate.get('articles.ingredients.notifications.ingredientDeletedContent').subscribe((res: string) => {
      this.ingredientDeletedContent = res;
    });

     this.translate.get('articles.ingredients.notifications.quarteringDeletedTitle').subscribe((res: string) => {
      this.quarteringDeletedTitle = res;
    });

     this.translate.get('articles.ingredients.notifications.quarteringDeletedContent').subscribe((res: string) => {
      this.quarteringDeletedContent = res;
    });
  }

  public getIngredients(){ 
    this.updating=true;
    this.ingredientService.getIngredients(
      this.itemsPerPage, 
      this.currentPage-1, 
      this.filterText, 
      this.sortField,
      this.sortOrder,
      this.filterLocation,
      null,
      this.active
    ).subscribe(
      (data:any) => {
        this.allIngredients = data.ingredients;
        this.totalItems = data.totalElements;
        this.loading = false;
        this.updating = false;
      },
      (err) => {
        this.notification.error('Error', err || 'Error');
      })
  }

  public printIngredient(ingredient){
    this.printData = {  
      id: ingredient._id,
      name: ingredient.lang.name, 
    } 
    this.print.next(this.printData)
  }

  public editIngredient(_id){
    this.router.navigate(['./articles/ingredients/edit', _id, {tab: 'Ingredient'}]);
  }

  public editQuartering(_id){
    this.router.navigate(['./articles/ingredients/edit', _id, {tab: 'Quartering'}]);
  }

  public viewIngredient(_id){
    this.router.navigate(['./articles/ingredients/',_id, {tab: 'Ingredient'}]);
  }

  public viewQuartering(_id){
    this.router.navigate(['./articles/ingredients/',_id, {tab: 'Quartering'}]);
  }

  public addIngredient(_id?){
    this.router.navigate(['./articles/ingredients/new']);
  }

  public selectIngredientToEdit(ingredient){
    this.ingredientOnEdit=ingredient;
  }

  public deleteIngredient(_id?, confirm?) {
    this.ingredientService.deleteIngredient(this.ingredientOnEdit._id).subscribe(
      (data) => {
        
        this.notification.success(this.ingredientDeletedTitle, this.ingredientDeletedContent);
        this.getIngredients();
      },
      (err) => {
          this.notification.error('Error', err || 'Error');
        })
  }

  public toggleActiveState(){

  	if(this.filterActive) {
  		if(this.active) {
  			this.active = false;
  		}
  		else 
  		{ 
  			this.filterActive = false;
  			this.active=null;
  		}
  	}
  	else
  	{
  		this.filterActive = true; 
  		this.active=true;
  	}
  	this.saveFilters();
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.ingredientService.saveCurrentPage(this.currentPage);
    this.getIngredients();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.ingredientService.saveItemsPerPage(item);
    this.currentPage = 1;
    this.getIngredients();
  }

  public searchIngredients(value: string){
    this.filterText=value;
    this.ingredientService.saveSearchFilter(this.filterText);
    this.currentPage=1;
    this.getIngredients();
  }

  public saveFilters(){
    this.ingredientService.saveFilters(this.sortField, this.sortOrder, this.active, this.filterActive);
    this.getIngredients();
  }

  public notificationDestroyed(e){
         
  }
}

