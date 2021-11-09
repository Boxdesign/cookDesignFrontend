import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllergenService } from '../../../libraries/allergen/allergen.service'


@Component({
  selector: 'allergen-edit',
  templateUrl: './allergen-edit.component.html',
  styleUrls: ['./allergen-edit.component.css']
})
export class AllergenEditComponent implements OnInit {
  @Input() article: any;
  @Output() articleChange = new EventEmitter<any>();
  
  @Input() mode: string;

  public allergens;  
  public someAllergen;	
  public allergensOnEdit;

  constructor( public allergensService: AllergenService ) { }

  ngOnInit() {
  	this.getAllergens();
  }

  public getAllergens() {
    this.allergensService.getAllergens(10000,0,'','').subscribe(
    (data: any) => {
      this.allergens = data.allergens;
      //recorreremos los alergenos, para cada alergeno buscaremos si tiene registro en el ingrediente, si es así, los mezclaremos
      if (this.article.allergens) {
        this.allergens.forEach((allergen, index) => {
          this.article.allergens.forEach((e, i) => {
            if(e.allergen == allergen._id){
              allergen.level=e.level;
            }
          })
  
        })
      } else if (this.article.category.item && this.article.category.item.allergens){
        this.allergens.forEach((allergen, index) => {
          this.article.category.item.allergens.forEach((e, i) => {
            if(e.allergen == allergen._id){
              allergen.level=e.level;
            }
          })
  
        })
      }
    this.allergensOnEdit = JSON.parse(JSON.stringify(this.allergens))
    this.someAllergen=this.allergens.some((allergen)=>{
				return	allergen.level>'0';
			})
    this.updateAllergens();    
    })    
  }

  public preSubmitGetAllergens() {
    //Antes de enviar el ingrediente a la api, cogeremos todos los alergenos que tengan algun nivel y los devolveremos.

    let importantAllgergens = [];

    this.allergens.forEach((e, i) => {
        if (e.level && e.level != 0) {

          var iAllergen = {
            'allergen': e._id,
            'level': e.level
          };

          importantAllgergens.push(iAllergen);
        }
      }
    );

    return importantAllgergens;
  }


  public allergenSelected(allergen, index) {
  	console.log(this.allergens, 'this.allergens selected')
    //Si no tiene nivel de gravedad le asignamos uno
    allergen.level = !allergen.level ? 0 : allergen.level;

    //Garantizamos que el nivel de gravedad maximo es 2
    allergen.level = allergen.level + 1 > 2 ? 0 : allergen.level + 1;

    //Modifying allergen implies modifying the allergen object in the view (2-way bindig) as well as the allergens array, this.allergens.
  }

  public updateAllergens() {
  	this.allergens = JSON.parse(JSON.stringify(this.allergensOnEdit));
    this.someAllergen=this.allergens.some((allergen)=>{
			return	allergen.level>'0';
			})
    console.log(this.someAllergen, 'some alergen')
    this.article.allergens = this.preSubmitGetAllergens()
    this.articleChange.emit(this.article)

  }

}
