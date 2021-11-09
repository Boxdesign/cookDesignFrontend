import { Checkpoint } from './checkpoint.model'

export class CookingStep {
  lang: any[]
  process: string
  utensil: string
  time: number
  timeUser: number
  temperature: number
  temperatureProbe: number
  pressure: number
  power: number
  vacuum: number
  criticalCheckpoint: Checkpoint
  gastroCheckpoint: Checkpoint
  images: any[]
  videos: any[]
  timeUnit: string
  timeUnitUser:string

  constructor() {
    this.time=0;
    this.temperature=0
    this.temperatureProbe=0
    this.pressure=0
    this.power=0
    this.vacuum=0
    this.process=null
    this.utensil=null
    this.criticalCheckpoint= null
    this.gastroCheckpoint= null
    this.images=[]
    this.videos=[]
    this.timeUnit='minutes'
    this.timeUser=0
    this.timeUnitUser='minutes'
  }
}