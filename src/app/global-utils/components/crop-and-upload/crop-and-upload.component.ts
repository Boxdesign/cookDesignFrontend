import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, ViewChild, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subject, Observable} from 'rxjs/Rx'
import * as Cropper from 'cropperjs/dist/cropper';
import { FileUploader} from 'ng2-file-upload';
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { UploadService } from '../../../global-utils/services/upload.service'


@Component({
  selector: 'crop-and-upload',
  templateUrl: './crop-and-upload.component.html',
  styleUrls: ['./crop-and-upload.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CropAndUploadComponent implements OnInit {
  @Input() cropperOptions: any;
  @Input() mode: string;
  @Input() upload = new Subject();
  @Input() gallery: any;
  @Input() folderPath: string;
  @Output() galleryChange = new EventEmitter<any>();
  @Output() uploadFinished = new EventEmitter<boolean>();


  @ViewChild('cropImage') cropImage;
  @ViewChild('image') image: ElementRef;

  public filePickerName;
  public photoName;
  public blob;
  public preview;
  public imageBase64;
  public cropper;
  public imageUpdated: boolean = false;
  public reader  = new FileReader();

  constructor(public appConfig: AppConfig, public uploadService: UploadService) { }

  ngOnInit() {
      console.log('on init')

  	// this.buildUploader();

  	this.upload.subscribe((data) => {
      console.log('upload in  crop')

  		this.uploadImage()
  	})

  	this.reader.onloadend = () => {
        this.imageBase64 = this.reader.result;
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let change in changes) {
      let cur = changes[change].currentValue;
      let prev = changes[change].previousValue;
      if (change == 'gallery' && cur!=prev) {
      this.imageBase64=null;
      this.preview=null;
      this.blob = null;
      this.photoName = null;
      this.imageUpdated=false;
      }
     }
    }

  /******** CROPPER ********/

  public readURL(event) { //Called when editing or adding an image, after image selected from input.

    if (event.srcElement.files.length) {
    	this.imageUpdated=true;
    	this.imageBase64 = null;
      this.filePickerName = event.srcElement.files[0].name;    

      if (event.target.files[0]) {
        this.reader.readAsDataURL(event.target.files[0]);
      }

      this.cropImage.show();     
    }
  }

  public imageCropper() { //Called when the user submits the cropped image

    this.preview = this.cropper.getCroppedCanvas().toDataURL();  

    this.cropper.getCroppedCanvas().toBlob((blob) => {
      this.blob = blob; //will be used at upload    
      console.log(this.blob)
    });      
    this.photoName = this.filePickerName; //will be used at upload
    this.cropImage.hide()    
  }

  public imageCancel() {
  if (!this.preview) {
    this.imageBase64 = null;
  }
  this.cropImage.hide()         
    
  }

	public deleteImage() {
	    this.gallery=null;
	    this.imageBase64=null;
	    this.preview=null;
	    this.blob = null;
	    this.photoName = null;
	    this.galleryChange.emit(this.gallery)
	    this.imageUpdated=false;
	  }  

	public imageLoaded(ev: Event) { //Input event called when the selected image has been loaded
	  const image = ev.target as HTMLImageElement;

	  this.cropperOptions = Object.assign({
				aspectRatio:1.33, 
				minContainerHeight: 376, 
				minContainerWidth: 500,
        zoomable: false,
        viewMode: 1,
        autoCrop: true,
        autoCropArea: 1,
        center: false,
        modal:true,
        responsive: true,
        background: true
    }, this.cropperOptions);

		this.cropper = new Cropper(image, this.cropperOptions);
	}

  /******** UPLOADER ********/

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return <File>theBlob;
  }

  public uploadImage() {

  	if(this.imageUpdated) {
      console.log('upload image')
	    let url = this.appConfig.apiUrl + '/gallery'
	    let file = this.blobToFile (this.blob, this.photoName)
      console.log(file, 'file')
	    this.uploadService.makeFileRequest(url, [], file, this.folderPath).subscribe(
	    	(data) => {
	    		this.gallery = data;
	    		this.galleryChange.emit(this.gallery)
	    		this.uploadFinished.next(true);
	    	});
		}
		else
		{
			//Image has not changed or has been deteled, no need to upload anything. Move on to the next step.
      this.uploadFinished.next(true);
		}
	}
}
