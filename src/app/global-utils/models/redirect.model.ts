export class Redirect {
  id: any
  versionId: any
  mode: string
  activated: boolean
  originPath: string

  constructor(originPath?, id?, versionId?, mode?, activated?) {
    this.originPath= originPath || ''
    this.id = id || null
    this.versionId = versionId || null
    this.mode = mode || ''
    this.activated = activated || false
  }
}