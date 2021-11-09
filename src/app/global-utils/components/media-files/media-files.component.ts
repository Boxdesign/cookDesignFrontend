import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from "ng2-file-upload";
import { AppConfig } from "../../services/appConfig.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'media-files',
  templateUrl: './media-files.component.html',
  styleUrls: ['./media-files.component.scss']
})
export class MediaFilesComponent implements OnInit {

  public uploader: FileUploader;
  public imageObj;
  @Input() public images;
  @Input() public videos;
  @Input() public viewMode: boolean = false;  //false is edit mode
  @Input() public viewEdit: boolean = false;  //false is edit mode
  public getVideoId = require('get-video-id');
  public videoUrl;
  public hello;
  public imageSelected;
  public videoSelected;
 
  constructor(public appConfig: AppConfig, public domSanitizer : DomSanitizer, public route : ActivatedRoute) { 
    
  }

  ngOnInit() {
    this.route.data.subscribe((data: {viewMode:boolean}) => {
      if(data.viewMode) this.viewMode = data.viewMode;
    });

    this.buildUploader();
  	//this.sanitizeVideoUrl();
  }

  public buildUploader() {
    this.uploader = null;
    this.uploader = new FileUploader({
      url: this.appConfig.apiUrl + '/gallery',
      authToken: localStorage.getItem('token'),
      removeAfterUpload: true,
      autoUpload: true
    });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.imageObj = JSON.parse(response);
      //console.log(this.imageObj,'imageObj')
      this.addImage();
    };

  }

  public sanitizeVideoUrl(){
  	//Add sanitized URL to image objects
  	this.videos.map(video => {
  		let videoUrl = 'https://www.youtube.com/embed/' + video.videoId;
  		video.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  		return video;})

  }

  public deleteImage(i){
    this.images.splice(i,1);
  }

  public addImage() {
  	this.images.push(this.imageObj);
  }

  public deleteVideo(i){
    this.videos.splice(i,1);
  }

  public addVideo(){

  	let videoId=this.getVideoId(this.videoUrl);
  	let thumbnailUrl='http://img.youtube.com/vi/' + videoId + '/1.jpg';
  	let videoUrl = 'https://www.youtube.com/embed/' + videoId;
    let sanitizedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);

    //Note: the sanitized URL is not stored in the database
    let videoObj = {
  		videoId: videoId,
  		url: videoUrl,
  		sanitizedUrl: sanitizedVideoUrl,
        thumbnailUrl: thumbnailUrl
  	}
  	this.videos.push(videoObj);
  	this.videoUrl='';

  }

  public selectImage(i) {
  	this.imageSelected=this.images[i];
  }

  public selectVideo(i) {
  	this.videoSelected=this.videos[i];
    let videoUrl = 'https://www.youtube.com/embed/' + this.videos[i].videoId;
    this.videoSelected.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
    

  public stopVideo() {   //if I want i can set scope to a specific region

      this.videoSelected.sanitizedUrl=this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/');

   }
}

//mirar this.domSanitizer.bypassSecurityTrustUrl per acabar de funcionar visualitzar video