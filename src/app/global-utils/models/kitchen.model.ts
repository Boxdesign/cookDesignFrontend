import { WorkRoom } from './workRoom.model'

export class Kitchen {
    _id: string
    lang: any[]
    referenceNumber : string
    workRooms: WorkRoom
    location: any

  constructor () {
  	this.lang=[];
  	this.location = []
  }

}