import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SubproductsService } from "../../../recipes/subproducts/subproducts.service";
import { ProductsService } from "../../../recipes/products/products.service";
import { SessionService } from "../../../global-utils/services/session.service";
import { DishService } from "../../../recipes/dishes/dish.service";
import { DrinkService } from "../../../recipes/drinks/drink.service";
import { TranslateService } from "ng2-translate/ng2-translate";
import { UtensilService } from "../../../libraries/utensil/utensil.service";
import { ProcessService } from "../../../libraries/process/process.service";
import { CheckpointService } from "../../../libraries/checkpoint/checkpoint.service";
import { CookingStep } from "../../../global-utils/models/cooking-step.model";
import { NotificationsService } from "angular2-notifications";
import { Observable, Subject } from "rxjs/Rx";
import { SelectModule } from "ng2-select";
import { CompassService } from "../../../global-utils/services/compass.service";
import { AppConfig } from "../../../global-utils/services/appConfig.service";

@Component({
  selector: "cooking-steps",
  templateUrl: "./cooking-steps.component.html",
  styleUrls: ["./cooking-steps.component.scss"],
})
export class CookingStepsComponent implements OnInit {
  @Input() public recipe;
  @Input() public recipeType;
  @ViewChild("selectProcess") selectProcess;
  @ViewChild("selectUtensil") selectUtensil;
  public cookingStep;
  public cookingStepIndex;
  public filterText: string = "";
  public searchBoxLabel: string;
  public totalElements = 0;
  public utensils;
  public processes;
  public gastroCheckpoints;
  public criticalCheckpoints;
  public forceLangRefresh = new EventEmitter();
  public cookingSteps;
  public cookingStepsLangs;
  public viewMode: boolean = false;
  public status;
  public timeOut;
  public mode;
  public activeProcess = [];
  processSubject: Subject<any> = new Subject();
  public previousSearch: string = null;
  public processElementsList;
  public processElementListSelector: Array<any> = [];
  public processElementsListPopulated: Boolean = false;
  public activeUtensil = [];
  utensilSubject: Subject<any> = new Subject();
  public utensilElementsList;
  public utensilElementListSelector: Array<any> = [];
  public utensilElementsListPopulated: Boolean = false;
  public cookingStepsTimeUnits;

  public cookingStepLang = {
    description: "",
    criticalCheckpointNote: "",
    gastroCheckpointNote: "",
  };

  public cookingStepUpdatedLang: any[] = [];

  public clone = require("clone");
  public searchCookingSteps;
  public utensilView;
  public utensilViewReady: boolean = false;
  public selectUndefinedOptionValue: any;

  constructor(
    public route: ActivatedRoute,
    public subproductService: SubproductsService,
    public utensilService: UtensilService,
    public processService: ProcessService,
    public translateservice: TranslateService,
    public checkpointService: CheckpointService,
    public sessionService:SessionService,
    public productService: ProductsService,
    public dishService: DishService,
    public notification: NotificationsService,
    public drinkService: DrinkService,
    public compassService: CompassService,
    public appConfigService: AppConfig
  ) {}

  ngOnInit() {

    this.route.data.subscribe((data: { viewMode: boolean }) => {
      if (data.viewMode) this.viewMode = data.viewMode;
      if (this.viewMode) this.mode = "view";
    });

    this.route.data.subscribe((data: { mode: string }) => {
      if (data.mode) this.mode = data.mode;
      //console.log(this.mode,'modeCS')
    });

    this.recipe.cookingSteps.forEach((cookStep) => {
      if (cookStep.criticalCheckpoint)
        cookStep.criticalCheckpoint = cookStep.criticalCheckpoint._id;
      if (cookStep.gastroCheckpoint)
        cookStep.gastroCheckpoint = cookStep.gastroCheckpoint._id;
    });

    this.moveUserLang();

    this.getCookingSteps();

    this.processSubject.debounceTime(300).subscribe((searchString) => {
      if (searchString === this.previousSearch) {
        //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.selectProcess.items = [];
        // force the ng-select to update and show the new list
        this.selectProcess.open();
        this.previousSearch = "";
      } else {
        this.previousSearch = searchString;
        this.processService.getProcess(50, 0, "", "", searchString).subscribe(
          (data: any) => {
            this.processElementsList = data.process;
            this.processElementsList.length = data.totalElements;
            if (this.processElementsList.length == 0) {
              let object = [
                {
                  id: 1,
                  text: "No results",
                },
              ];

              this.selectProcess.items = object;
              this.selectProcess.open();
            } else {
              let elementData = this.processElementsList.map(
                (element, index) => {
                  let object = {
                    id: element,
                    text: element.lang[0].name,
                  };
                  return object;
                }
              );
              this.selectProcess.items = elementData;
              this.selectProcess.open();
            }
          },
          (err) => {
            this.notification.error("Error", err || "Error");
          }
        );
      }
    });

    this.utensilSubject.debounceTime(300).subscribe((searchString) => {
      if (searchString === this.previousSearch) {
        //required to fix a 'bug' where searchString never becomes empty
        // string was deleted so assign empty array to ng-select items
        this.selectUtensil.items = [];
        // force the ng-select to update and show the new list
        this.selectUtensil.open();
        this.previousSearch = "";
      } else {
        this.previousSearch = searchString;
        this.utensilService
          .getUtensil(50, 0, "+lang.name", "", searchString)
          .subscribe(
            (data: any) => {
              console.log(data,'utensils')
              this.utensilElementsList = data.utensils;
              this.utensilElementsList.length = data.totalElements;
              if (this.utensilElementsList.length == 0) {
                let object = [
                  {
                    id: 1,
                    text: "No results",
                  },
                ];

                this.selectUtensil.items = object;
                this.selectUtensil.open();
              } else {
                let elementData = this.utensilElementsList.map(
                  (element, index) => {
                    let object = {
                      id: element,
                      text: element.lang ? element.lang.name : "",
                    };
                    return object;
                  }
                );
                //console.log(elementData,'elementData')
                this.selectUtensil.items = elementData;
                this.selectUtensil.open();
              }
            },
            (err) => {
              this.notification.error("Error", err || "Error");
            }
          );
      }
    });

    this.translate();
    this.getProcesses();
    this.getUtensils();
    this.getCheckpoints();
    this.tagUpAndDownArrows();
    this.fetchCookingStepTimeUnits();
    this.totalElements = this.recipe.cookingSteps.length;
  }

  public translate() {
    this.translateservice
      .get("searchBox.beginText")
      .subscribe((res: string) => {
        this.searchBoxLabel = res;
      });
  }

  public langObjRefreshed(e) {
    this.cookingStepUpdatedLang = this.clone(e.langsObj);
  }

  //Method to move to the first position of the lang array the user language
  public moveUserLang(){
    let userLanguage = this.sessionService.userLanguage();
    for(var cookingStep of this.recipe.cookingSteps){
      let indexcookingStepLang, indexProcessLang, indexUtensilLang;
      let cookingStepLang, processLang, utensilLang;
      for(var i=0; i<cookingStep.lang.length; i++){
        if(cookingStep.lang[i].langCode == userLanguage) {
          cookingStepLang = cookingStep.lang[i];
          indexcookingStepLang = i;
        }
      }
      if(indexcookingStepLang && cookingStepLang) {
        cookingStep.lang.splice(indexcookingStepLang,1);
        cookingStep.lang.unshift(cookingStepLang);
      }

      for(var i=0; i<cookingStep.process.lang.length; i++){
        if(cookingStep.process.lang[i].langCode == userLanguage) {
          processLang = cookingStep.process.lang[i];
          indexProcessLang = i;
        }
      }

      if(indexProcessLang && processLang) {
        cookingStep.process.lang.splice(indexProcessLang,1);
        cookingStep.process.lang.unshift(processLang);
      }

      for(var i=0; i<cookingStep.utensil.lang.length; i++){
        if(cookingStep.utensil.lang[i].langCode == userLanguage) {
          utensilLang = cookingStep.utensil.lang[i];
          indexUtensilLang = i;
        }
      }

      if(indexUtensilLang && utensilLang) {
        cookingStep.utensil.lang.splice(indexUtensilLang,1);
        cookingStep.utensil.lang.unshift(utensilLang);
      } 
    }
  }

  public getUtensils() {
    this.utensilService.getUtensil(1000000, 0, "", "", "").subscribe(
      (data: any) => {
        this.utensils = data.utensils;
        this.utensilElementsList = data.utensils;
      },
      (err) => {
        this.notification.error("Error", err || "Error");
      }
    );
  }

  public getProcesses() {
    this.processService.getProcess(1000000, 0, "", "").subscribe(
      (data: any) => {
        this.processElementsList = data.process;
        this.processes = data.process;
      },
      (err) => {
        this.notification.error("Error", err || "Error");
      }
    );
  }

  public getCookingSteps() {
    //This is just an endpoint to get the cooking steps with the user lang. I could not manage to do that with the get subproduct
    //version endpoint. Currently not use

    switch (this.recipeType) {
      case "subproduct":
        this.subproductService
          .getCookingSteps(this.recipe._id, this.recipe.versionId)
          .subscribe(
            (data: any) => {
              this.cookingSteps = data;
            },
            (err) => {
              this.notification.error("Error", err || "Error");
            }
          );
        break;

      case "product":
        this.productService
          .getCookingSteps(this.recipe._id, this.recipe.versionId)
          .subscribe(
            (data: any) => {
              this.cookingSteps = data;
            },
            (err) => {
              this.notification.error("Error", err || "Error");
            }
          );
        break;

      case "dish":
        this.dishService
          .getCookingSteps(this.recipe._id, this.recipe.versionId)
          .subscribe(
            (data: any) => {
              this.cookingSteps = data;
            },
            (err) => {
              this.notification.error("Error", err || "Error");
            }
          );
        break;

      case "drink":
        this.drinkService
          .getCookingSteps(this.recipe._id, this.recipe.versionId)
          .subscribe(
            (data: any) => {
              this.cookingSteps = data;
            },
            (err) => {
              this.notification.error("Error", err || "Error");
            }
          );
        break;
      default:
        // code...
        break;
    }
  }

  public getCheckpoints() {
    this.checkpointService
      .getCheckpoint("gastronomic", 1000000, 0, "", "")
      .subscribe(
        (data: any) => {
          this.gastroCheckpoints = data.checkpoints;
          // console.log(data,'dataG')
          // console.log(this.gastroCheckpoints,'gastroCheck')
        },
        (err) => {
          this.notification.error("Error", err || "Error");
        }
      );

    this.checkpointService
      .getCheckpoint("critical", 1000000, 0, "", "")
      .subscribe(
        (data: any) => {
          this.criticalCheckpoints = data.checkpoints;
          // console.log(data,'dataC')
          // console.log(this.criticalCheckpoints,'criticalCheck')
        },
        (err) => {
          this.notification.error("Error", err || "Error");
        }
      );
  }

  processSearchChanged(value) {
    this.processSubject.next(value);
  }

  utensilSearchChanged(value) {
    this.utensilSubject.next(value);
  }

  //  public subproductElementRemoved(value, add){ //called when user removes ingredient or subproduct
  // 	this.subproductElement.element.item = null;
  // }

  public saveCookingStep() {
    this.forceLangRefresh.emit(true);
    this.cookingStep.lang = this.clone(this.cookingStepUpdatedLang);
    if (this.cookingStep.gastroCheckpoint == "null")
      this.cookingStep.gastroCheckpoint = null;
    if (this.cookingStep.criticalCheckpoint == "null")
      this.cookingStep.criticalCheckpoint = null;

    if (this.status == "new") {
      this.recipe.cookingSteps.push(this.cookingStep);
      this.totalElements = this.recipe.cookingSteps.length;
      this.tagUpAndDownArrows();
      this.cleanAndResetFields();
    } else if (this.status == "edit") {
      //replace object in position subproductElementOnEditIndex
      this.recipe.cookingSteps.splice(
        this.cookingStepIndex,
        1,
        this.cookingStep
      );
    }
  }

  public addClick() {
    //console.log(this.criticalCheckpoints,'CCAdd')

    this.cookingStep = new CookingStep();
    // this.cookingStep.utensil=this.utensils[0];
    // this.cookingStep.process=this.processes[0];
    // this.cookingStep.criticalCheckpoint=this.criticalCheckpoints[0];
    // this.cookingStep.gastroCheckpoint=this.gastroCheckpoints[0];
    this.status = "new";
    this.cleanAndResetFields();
  }

  public viewClick() {
    this.status = "view";
  }

  public editClick() {
    this.status = "edit";
  }

  // public selectElementToDelete(compositionElement, index){

  // 	//Save index position for deleting later
  // 	this.subproductElementIndex = this.subproductOnEdit.composition.indexOf(compositionElement);
  // }

  public deleteCookingStep(index) {
    this.recipe.cookingSteps.splice(index, 1);

    this.totalElements = this.recipe.cookingSteps.length;

    if (this.totalElements > 0) {
      this.cleanAndResetFields();
      this.tagUpAndDownArrows();
    }
  }

  public cleanAndResetFields() {
    this.cookingStepLang = {
      description: "",
      criticalCheckpointNote: "",
      gastroCheckpointNote: "",
    };
    this.activeProcess = [{ id: -1, text: "" }]; //bogus active element
    this.activeProcess = [];

    this.activeUtensil = [{ id: -1, text: "" }]; //bogus active element
    this.activeUtensil = [];
    // this.getProcesses();
    // this.getUtensils();
    //this.getCheckpoints();
  }

  public processSelected(value) {
    this.cookingStep.process = value.id;
  }

  public utensilSelected(value) {
    // mirar productos, pasarle el valor y montar cookingStep.process con la ayuda del array ProcessElementsList y el valor seleccionado del proceso (value)
    this.cookingStep.utensil = value.id;
  }

  public selectUtensilForView(cookingStep, index) {
    let utensilViewId = cookingStep.utensil._id;
    this.utensilService.getUtensilVersion(utensilViewId).subscribe(
      (data: any) => {
        this.utensilView = data;
        if (data.subfamily) {
          this.utensilView.family.subfamilies.forEach((subfamily) => {
            if (this.utensilView.subfamily == subfamily._id) {
              this.utensilView.subfamily = subfamily;
            }
          });
        }
        //console.log(data,'dataG')
        this.utensilViewReady = true;
        console.log(this.utensilView, "utensilView");
      },
      (err) => {
        this.notification.error("Error", err || "Error");
      }
    );
  }

  public selectCookingStep(cookingStep, index) {
    var subElementsIndex;

    //We can't use this.cookingStep=cookingStep because it does a deep copy. This means that
    //when updating this.cookingStep we are actually updating this.recipe. As a result, when
    //the user updates values in the edit form before pressing 'save', it is already updating recipe which
    //is not what we want.
    //Instead we use Object.assign which makes a copy but does not do deep linking.
    this.cookingStep = this.clone(cookingStep);

    this.cookingStepIndex = this.recipe.cookingSteps.indexOf(cookingStep);
    if (!this.cookingStep.time) this.cookingStep.time = 0; //init time unit with minutes
    if (!this.cookingStep.timeUnit) this.cookingStep.timeUnit = "minutes"; //init time unit with minutes
    if (!this.cookingStep.temperature) this.cookingStep.temperature = 0; //init time unit with minutes
    if (!this.cookingStep.timeUser) this.cookingStep.timeUser = 0;
    if (!this.cookingStep.timeUnitUser)
      this.cookingStep.timeUnitUser = "minutes";

    this.timeOut = setTimeout(() => {
      this.forceLangRefresh.emit(this.cookingStep.lang);
    }, 10);
    //console.log(this.processElementsList,'PEL')
    this.processes.find((sp, i) => {
      // console.log(sp,'sp')
      // console.log(this.cookingStep,'CSinside')
      if (sp._id == this.cookingStep.process._id) {
        subElementsIndex = i;
        this.activeProcess = [];
        let object = {
          //used for selector
          id: subElementsIndex,
          text: sp.lang[0].name,
        };
        this.activeProcess.push(object);
        //console.log(this.activeProcess,'activeProcess')
      }
    });

    this.utensils.find((sp, i) => {
      // console.log(sp,'sp')
      // console.log(this.cookingStep,'CSinside')
      if (sp._id == this.cookingStep.utensil._id) {
        subElementsIndex = i;
        this.activeUtensil = [];
        let object = {
          //used for selector
          id: subElementsIndex,
          text: sp.lang? sp.lang.name: '',
        };
        this.activeUtensil.push(object);
        //console.log(this.activeProcess,'activeProcess')
      }
    });
    // this.subproductService.getSubproduct(this.recipe._id, this.recipe.versionId).subscribe(
    //  	(data: any) => {
    //  		this.cookingStepsLangs = data[0].versions.cookingSteps[index].lang;
    //  		this.forceRefreshCSForEdit.emit(this.cookingStepsLangs);
    //  })
  }

  public tagUpAndDownArrows() {
    var numSteps = this.recipe.cookingSteps.length;

    //reset up and down tags
    this.recipe.cookingSteps.map((step) => {
      step.stepDown = false;
      step.stepUp = false;
    });

    this.recipe.cookingSteps.forEach((step, index) => {
      if (index > 0) step.stepUp = true;
      if (index < numSteps - 1) step.stepDown = true;
    });
  }

  public moveStepUp(cookingStep, index) {
    let step = this.clone(cookingStep);

    //delete object in position index
    this.recipe.cookingSteps.splice(index, 1);

    //insert object in new position
    this.recipe.cookingSteps.splice(index - 1, 0, step);

    this.tagUpAndDownArrows();
  }

  public moveStepDown(cookingStep, index) {
    let step = this.clone(cookingStep);

    //delete object in position index
    this.recipe.cookingSteps.splice(index, 1);

    //insert object in new position
    this.recipe.cookingSteps.splice(index + 1, 0, step);

    this.tagUpAndDownArrows();
  }

  public closeUtensil() {
    this.utensilView = "";
    this.utensilViewReady = false;
  }

  private fetchCookingStepTimeUnits() {
    this.appConfigService.fetchCookingStepsTimeUnits().subscribe((res) => {
      this.cookingStepsTimeUnits = [];
      res.forEach((timeUnit) => {
        this.cookingStepsTimeUnits.push(timeUnit.unit);
      });
    });
  }
}
