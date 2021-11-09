import {Component, Output, EventEmitter, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppConfig} from "../../services/appConfig.service";

@Component({
  selector: 'lang-tab',
  templateUrl: './lang-tab.template.html',
})

export class LangTabComponent {
  @Output() languageChanged = new EventEmitter();
  @Output() langsObj = new EventEmitter();

  @Input() fieldsObj;
  @Input() builtFieldsObj;
  @Input() forceRefresh;

  public languages = [];
  public currentLangCode = 'es';
  public builtLangObj = []; //Sera el objeto con los arrays de los idiomas

  constructor(appConfig: AppConfig) {

    this.languages = appConfig.appLanguages || [];

    // Si nos se ha cargado los idiomas, forzaremos la carga. ()
    this.languages.length || appConfig.fetchAppLanguages().subscribe(
      (data) => {
        this.languages = data.languages;
      }
    );
  }


  ngOnInit() {

    this.languageSelected({langCode: 'es'});
  }

  ngAfterViewInit() {
    //console.log(this.forceRefresh,'forceRefreshAfterViewInit');

    //Cuando el componente padre nos diga que quiere la array de idiomas acltualizada, se la daremos.
    this.forceRefresh.subscribe(
      (data) => {
        this.languageSelected({langCode: this.currentLangCode});
        //this.builtLangObj = [];
        //this.currentLangCode = 'es';


        //TODO por algun motivo, el objeto builtFieldsObj no se regenera, obtendremos el objeto compuesto de DATA

        //si ya tenemos el objeto con los idiomas, lo asignamos:
        if (data && data.length) {
          let currentLangIndex;
          this.builtLangObj = data;

          //Cogemos el indice del idioma actual.
          this.builtLangObj.forEach((e, i) => {
            if (e.langCode == this.currentLangCode) {
              currentLangIndex = i;
            }
          });

          Object.keys(this.fieldsObj).forEach((e, i) => {

            //Como hemos cambiado el idioma, hay que reiniciar los campos A no ser.....
            if (this.builtLangObj[currentLangIndex] && this.builtLangObj[currentLangIndex][e]) {
              this.fieldsObj[e] = this.builtLangObj[currentLangIndex][e];
            } else {
              this.fieldsObj[e] = '';
            }
            //console.log(this.fieldsObj,'fieldsObjAfterViewInit')
          });

          //  this.languageSelected(this.currentLangCode);
        }
      }
    );
  }


  public languageSelected(lang) {
    //console.log(lang,'langLanguageSelected')
    let currentLangIndex;
    let newLangIndex;

    //Cogemos el indice del idioma actual (si hay).
    
    this.builtLangObj.forEach((e, i) => {

      if (e.langCode == this.currentLangCode) {
        currentLangIndex = i;
      }
      if (e.langCode == lang.langCode) {
        newLangIndex = i;
      }
    });

    
    if (isNaN(currentLangIndex)) {
      this.builtLangObj.push({langCode: this.currentLangCode});
      currentLangIndex = this.builtLangObj.length - 1;
    }


    //Tenimamos creada en la array de idiomas un elemento con el idioma actual, lo actulizaremos
    if (!isNaN(currentLangIndex)) {

      //Para cada elemento de fieldsObj, crearemos una entrada en builtLangObj
      
      Object.keys(this.fieldsObj).forEach((e, i) => {
        this.builtLangObj[currentLangIndex][e] = this.fieldsObj[e];

        //Como hemos cambiado el idioma, hay que reiniciar los campos A no ser.....
        if (this.builtLangObj[newLangIndex] && this.builtLangObj[newLangIndex][e]) {
          this.fieldsObj[e] = this.builtLangObj[newLangIndex][e];
        } else {
          this.fieldsObj[e] = '';
        }
      });

      // console.log(this.fieldsObj,'fieldsObj')
      // console.log(this.builtLangObj,'builtLangObj')
    }


    //cambiamos el idioma
    this.currentLangCode = lang.langCode;
    this.languageChanged.emit({
      langCode: lang.langCode
    });
    //console.log(this.languageChanged,'languageChanged', lang,'langToEmitinEvent')

    //Emitimos el objeto.
    this.emitBuiltLang();

  }


  public emitBuiltLang() {
    //console.log(this.builtLangObj,'emitBuiltLangObj')
    this.langsObj.emit({langsObj: this.builtLangObj})
  }

}
