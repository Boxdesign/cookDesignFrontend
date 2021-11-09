import { TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

export function translateFactory(http: Http){ 
   return new TranslateStaticLoader(http, '/assets/i18n', '.json');
 }