export class Contact {
  id: string
  name: string
  job: string
  email: string
  phone: string

  constructor(name="", job="", email="", phone="") {
    this.name = name
    this.job = job
    this.email = email
    this.phone = phone
  }
}