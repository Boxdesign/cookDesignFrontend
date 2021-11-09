
export class subFamily {
    _id: string;
    lang: any[];
    category: string;
    referenceNumber: string;
    externalCode: string;
    externalSubfamily: boolean;

  constructor () {
    this.lang = [];
    this.externalCode = "";
    this.externalSubfamily = false;
  }
}
