import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConfig } from '../../../global-utils/services/appConfig.service'
import { UploadService } from '../../../global-utils/services/upload.service'



@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  @Input() folderPath: string;
  @Input() id;
  @Input() status;
  @Output() hasDataSheet = new EventEmitter();

  public file;
  public folderPathGet;
  public folderPathUpload;
  public allFiles = [];
  public showFiles;
	public sortField: string;
	public sortOrder: number;
	public filterText: string = '';
  public totalItems: number;
  public currentPage: number = 1; //currentPage=1 means page 1!! When passing params to API we adjust page 1 to position zero in the array.  
  public itemsPerPage: number = 10; //Default items per page
  public numPages:number;
  public fileSelected;

  constructor(public appConfig: AppConfig, public uploadService: UploadService) { }

  ngOnInit() {
  	this.currentPage = this.uploadService.getCurrentPage();
    this.itemsPerPage = this.uploadService.getItemsPerPage();
  	this.listFiles();
  }

   public readURL(event) { 
   	this.file = event.target.files[0]
   	this.uploadFile();
  }
  public uploadFile() {
	  let url = this.appConfig.apiUrl + '/document/document'
	  this.folderPathUpload = this.folderPath + '/' + this.id + '/' + this.file.name
	  let params = [{
	  	key: 'id', 
	  	value: this.id
	  }]
	  this.uploadService.makeFileRequest(url, params, this.file, this.folderPathUpload).subscribe(
	  	(data) => {
	  		this.listFiles();
	  	});
		}

	public listFiles(){
    let completeName;
  	this.folderPathGet = this.folderPath + '/' + this.id
		this.uploadService.listFiles(this.folderPathGet).subscribe(
  	(data) => {
      if(data.KeyCount > 0 ) this.hasDataSheet.emit(true)
      else if (data.KeyCount == 0 ) this.hasDataSheet.emit(false)
      this.allFiles = data.Contents;
      this.totalItems = this.allFiles.length
      this.allFiles.forEach((file) => {
        completeName = file.Key.replace(this.folderPathGet + "/", "")
				file.type = completeName.split(".").pop()
        file.name = completeName.replace("." + file.type, "")
	    })
  	});
	}
	public getFile(file){
		this.uploadService.getFile(file.Key).subscribe(
  		(data) => {	  		
	  		var bytes = new Uint8Array(data.Body.data); // pass your byte response to this constructor

	  		var blob;

	  		if(file.type == 'pdf') {
					blob=new Blob([bytes], {type: "application/pdf"});// change resultByte to bytes
	  		} else {
	  			blob=new Blob([bytes], {type: "application/octet-stream"});// change resultByte to bytes
	  		}

				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=file.name;
				link.click();
  	});
	}

	public deleteFile(){
		this.uploadService.deleteFile(this.fileSelected.Key).subscribe(
  		(data) => {	  
        this.listFiles();
              
    });
  }

  public searchFiles(filterText){
    this.filterText = filterText;  
  }

  public pageHasChanged(data) {
    this.itemsPerPage = data.itemsPerPage;
    this.currentPage = data.page;
  }

  public updateItemsPerPage(item: number) {
    this.itemsPerPage = item;
    this.currentPage = 1;
  }

  public fileSelect(file) {
    this.fileSelected = JSON.parse(JSON.stringify(file));
    this.fileSelected.newName = this.fileSelected.name

  }
 public changeName() {
   if(this.fileSelected.name != this.fileSelected.newName) {
   this.uploadService.changeName(this.fileSelected).subscribe(
      (data) => {        
	  		this.listFiles();
    });     
   }
  }
 
}
