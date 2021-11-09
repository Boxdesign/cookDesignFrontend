import { Component, Input, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { ComponentHelper } from '../../global-utils/helpers/component.helper';

@Component({
  selector: 'image-listbox',
  templateUrl: './image-listbox.component.html',
  styleUrls: ['./image-listbox.component.scss'],
  providers: [ConfirmationService]
})
export class ImageListboxComponent implements OnChanges {
  @Input() options
  @Input() uploadUrl
  @Input() document
  @Input() agg
  @Input() disabled

  selected: {}

  constructor ( public confirmationService: ConfirmationService,
                public _ch: ComponentHelper,
              ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.selected = {}
  }

  remove(item) {
    this._ch.removeByAttr(this.options, "value", item)
    this.selected = {}
  }

  confirm() {
    console.log(this.selected)
    console.log(this.options)
    this.confirmationService.confirm({
        message: "delete_confirmation",
        accept: () => {
            this.remove(this.selected)
        }
    });
  }

  onUploadIdDocument(event) {
    // var elements = JSON.parse(event.xhr.response)

    // for (var i=0; i<elements.length; i++) {
    //   var element = elements[i]
    //   this.document.push(element)
    // }

    var element = JSON.parse(event.xhr.response);
    console.log(element, 'element')

    this.document.push(element);
  }

  onBeforeSend(event) { //add token to XmlHttpRequest sent by fileUpload
    let xmlhttp = event.xhr;
    xmlhttp.setRequestHeader("Authorization", localStorage.getItem('token'));
  }
}