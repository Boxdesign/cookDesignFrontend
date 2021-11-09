import { Component, ViewContainerRef, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeasurementUnitService } from './measurement-unit.service';
import { NotificationsService } from 'angular2-notifications'
import { AppConfig } from "../../global-utils/services/appConfig.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './measurement-unit.component.html'
})
export class MeasurementUnitComponent {

  units: any[];
  baseUnits: any[];
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.
  public itemsPerPage: number = 10; //Default items per page
  public orderBy: string = '';
  public searchBoxLabel: string;
  public filterText: string = '';
  public numPages:number;

  mu = {
    name: '',
    shortName: ''
  };

  public currentLangCode;
  public oldLangCode;
  public muLangs: any[] = [];

  public conv = {
    unit: '',
    quantity: 0,
    _id: '',
    parent: '',
    localIndex: '',
    index: ''
  };

  public editedMu: any[] = [];
  public tempMu;
  public referenceCode
  public codeTypes = []
  public forceRefresh = new EventEmitter();
  public forceRefreshForEdit = new EventEmitter();
  public options = {
     timeOut: 1500,
    position: ["top", "right"]
  }

  constructor(
  	public measurementUnitService: MeasurementUnitService, 
  	public  appConfig: AppConfig, 
  	public translate: TranslateService, 
  	public notification : NotificationsService
  ) {}


  ngOnInit() {

    this.translate.get('searchBox.beginText').subscribe((res: string) => {
      this.searchBoxLabel = res;
    });

    this.getMeasurementUnits(); //Make API request to get items of first page.
  }

  public langObjRefreshed(e) {
    this.muLangs = e.langsObj;
  }

  getMeasurementUnits() {
    //In the array page 1 is in the zero position, page 2 in position one, etc
    this.measurementUnitService.getUnits(this.itemsPerPage, this.currentPage - 1, this.orderBy, this.filterText).subscribe(
      (data: any) => {
        this.units = data.measurementUnits;
        this.totalItems = data.totalElements;
        this.referenceCode=''
        this.getIsoCodes();
        //console.log('perPage:' + perPage + 'page:' + page + 'orderBy:' + orderBy + 'filterText:' + filterText);
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getIsoCodes(){

    this.measurementUnitService.fetchIsoCodes().subscribe(
      (res)=>{
        //console.log(res,'resCODES')
        this.codeTypes = res
    })
  }

  getBaseUnits() {
    //console.log('get unidades base');
    //console.log(unit);
    this.conv.quantity = undefined; //reset value before showing in form
    this.conv.unit = undefined; //reset value before showing in form
    this.measurementUnitService.getBaseUnits().subscribe(
      (data: any) => {
        this.baseUnits = data.measurementUnits.filter((baseUnit) => this.filterBaseUnits(baseUnit));
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
        console.error(err);
      }
    )
  }

  public filterBaseUnits(baseUnit): boolean {
    //console.log('parent units' + mu.parentUnits);
    for (let u of this.tempMu.parentUnits) {
      //console.log('base unit:'+baseUnit._id+'parent unit:'+u.unit._id);
      if (u.unit._id == baseUnit._id) {
        //console.log('match!!');
        return false;
      }
    }
    //console.log('no match');
    return true;
  }

  public createNewMu() {
    //  this.preSubmitUpdateLangs();
    this.forceRefresh.emit(true);

    let unidadObj = {
      lang: this.muLangs,
      referenceCode:''
    };

    if(this.referenceCode&&this.referenceCode!=''&&this.referenceCode!=0){
      unidadObj.referenceCode = this.referenceCode
      //console.log(unidadObj.referenceCode,'referenceCode')
    }

    this.measurementUnitService.addUnit(unidadObj).subscribe(
      (data) => {
        this.notification.success('Unidad creada');
        //console.info(data);
        this.getMeasurementUnits();
        this.mu.name = " ";
        this.mu.shortName = " ";
        this.referenceCode= ''
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
        console.log(err);
      }
    );
  }

  public selectMuToEdit(mu) {

    this.tempMu = mu;
    if(this.tempMu.referenceCode){
      this.referenceCode = this.tempMu.referenceCode
    } else {
      this.referenceCode = 0;
    }
    //this.mu = mu.lang[0];

    this.measurementUnitService.getLangsUnidades(mu._id).subscribe(
      (data:any) => {
        this.editedMu = data.lang;
        console.log(this.tempMu,'tempmuToEdit',this.editedMu,'editedMu');
        this.forceRefreshForEdit.emit(this.editedMu);
      }
    )
  }

  public editMu() {
    this.forceRefreshForEdit.emit(true);

    this.tempMu.lang = this.muLangs;
    if(this.referenceCode&&this.referenceCode!=''&&this.referenceCode!=0){
      this.tempMu.referenceCode = this.referenceCode
      //console.log(this.tempMu,'referenceCodeEdit')
    }
    //console.log(this.tempMu);
    this.measurementUnitService.editUnit(this.tempMu).subscribe(
      (data) => {
        this.notification.success('Unidad guardada');
        this.mu = {
          name: '',
          shortName: ''
        };
        this.referenceCode= ''
        this.getMeasurementUnits();
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

	public resetAddForm(form:NgForm){
		form.onReset();
    this.referenceCode = 0
	}

  public addConversion() {
    this.conv.index = undefined;
    this.conv.localIndex = undefined;
    this.conv.parent = undefined;
    this.conv._id = undefined;

    //console.log(this.conv);
    this.tempMu.parentUnits.push(this.conv);

    this.measurementUnitService.editUnit(this.tempMu).subscribe(
      (data) => {
        this.notification.success('Conversión guardada');
        this.getMeasurementUnits();
      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  public selectConvToEdit(conv, parent, localIndex) {
    //console.log(conv.unit.lang[0].name);
    this.conv._id = conv.unit._id;
    this.conv.unit = conv.unit.lang[0].name;
    this.conv.quantity = conv.quantity;
    this.conv.index = conv.index;
    this.conv.parent = parent;
    this.conv.localIndex = localIndex;

    //console.log(this.conv);

  }

  public editConversion() {
    //Reemplazamos
    this.units[this.conv.parent].parentUnits[this.conv.localIndex].unit = this.conv._id;
    this.units[this.conv.parent].parentUnits[this.conv.localIndex].quantity = this.conv.quantity;

    this.measurementUnitService.editUnit(this.units[this.conv.parent]).subscribe(
      (data) => {
        this.notification.success('Unidad guardada');
        this.getMeasurementUnits();

      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  public deleteConversion(conversionUnit, parentUnit) {

    this.measurementUnitService.deleteConversionUnit(parentUnit._id, conversionUnit._id).subscribe(
      (data) => {
        this.notification.success('Conversión eliminada');
        this.getMeasurementUnits();

      },
      (err) => {
        this.notification.error('Error', err || 'Server Error');
      }
    )
  }

  public deleteMu(id) {

    this.measurementUnitService.deleteUnit(id).subscribe(
      (data) => {
        this.notification.success('Unidad eliminada');
        this.getMeasurementUnits();
      },
      (err) => {
        console.log(err);
        this.notification.error('Error', err || 'Server Error');
      }
    );
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
    this.getMeasurementUnits();
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
    this.getMeasurementUnits();
  }

  public searchUnidades(value: string) {
    this.filterText = value;
    this.currentPage = 1;
    this.getMeasurementUnits();
    this.filterText = '';
  }

  sortColumn(e, column: string) {
    this.filterText='';
    this.orderBy=e+'lang.'+column;
    //console.log(this.orderBy);
    this.getMeasurementUnits();
  }

  public codeTypeSelected(code) {
    this.referenceCode = code
  }
}
