import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { ComponentHelper } from '../../helpers/component.helper';
import { Contact } from '../../models/contact.model';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'contact-datatable',
  templateUrl: './contact-datatable.component.html',
  styleUrls: ['./contact-datatable.component.scss'],
  providers: [ConfirmationService]
})
export class ContactDatatableComponent implements OnInit {
  @Input() value
  @Input() disabled

  selected: Contact
  contact: Contact = new Contact()
  mode: string

  dialog_add_show = false
  dialog_edit_show = false
  confirmDelete;
  dialog_edit_value;

  @ViewChild('nameElement') nameElement

  constructor ( public confirmationService: ConfirmationService,
  				public translate: TranslateService,
                public _ch: ComponentHelper,
              ) {

  	this.translate.get('contactDatatable.confirmDelete').subscribe((res: string) => {
      this.confirmDelete = res;
    });
  }

  ngOnInit() {

  }

  addClick() {
    this.mode = "add"
    this.contact = new Contact()
    this.dialog_add_show = true
  }

  editClick() {
    this.mode = "edit"
    this.contact = this.selected
    this.dialog_add_show = true
  }

  addValue() {
    if (this.contact) {
      if (this.mode == "add")
        this.value.push(this.contact)
    }

    this.selected = this.contact
    this.dialog_add_show = false
  }

  setFocus(option) {
    switch(option) {
      case 'add':
        this._ch.setFocus(this.nameElement)
        break;
      case 'edit':
        this._ch.setFocus(this.nameElement)
        break;
    }
  }

  remove(item) {
    this._ch.removeByItem(this.value, item)
  }

  confirm() {
    this.confirmationService.confirm({
        message: this.confirmDelete,
        accept: () => {
            this.remove(this.selected)
        }
    });
  }
  editValue(){}
}