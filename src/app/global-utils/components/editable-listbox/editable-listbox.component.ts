import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ComponentHelper } from '../../helpers/component.helper';

@Component({
  selector: 'editable-listbox',
  templateUrl: './editable-listbox.component.html',
  styleUrls: ['./editable-listbox.component.scss'],
  providers: [ConfirmationService]
})
export class EditableListboxComponent implements OnInit {
  @Input() options
  @Input() disabled
  selected: string
  dialog_add_value = ""
  dialog_edit_value = ""
  dialog_add_show = false
  dialog_edit_show = false
  confirmDelete;

  @ViewChild('addInputElement') addInputElement
  @ViewChild('editInputElement') editInputElement

  constructor ( public confirmationService: ConfirmationService,
                public translate: TranslateService,
                public _ch: ComponentHelper,
              ) {
  	this.selected = null;
  	
  	this.translate.get('editableListBox.confirmDelete').subscribe((res: string) => {
      this.confirmDelete = res;
    });

  }

  ngOnInit() {

  }

  addClick() {
    this.dialog_add_show = true
  }

  editClick() {
    this.dialog_edit_value = this.options[this.selected].label
    this.dialog_edit_show = true
  }

  addValue() {
    //console.log(this.options)
    if (this.dialog_add_value)
      this._ch.pushValue(this.options, this.dialog_add_value)
    this.dialog_add_value = ""
    this.dialog_add_show = false
  }

  editValue() {
    if (this.dialog_edit_value)
      this._ch.editValue(this.options, this.selected, this.dialog_edit_value)
    this.dialog_edit_value = ""
    this.dialog_edit_show = false
    this.selected = null
  }

  setFocus(option) {
    switch(option) {
      case 'add':
        this._ch.setFocus(this.addInputElement)
        break;
      case 'edit':
        this._ch.setFocus(this.editInputElement)
        break;
    }
  }

  remove(item) {
    this._ch.removeByAttr(this.options, "value", item)
  }

  confirm() {
    this.confirmationService.confirm({
        message: this.confirmDelete,
        accept: () => {
            this.remove(this.selected)
        }
    });
  }
}

