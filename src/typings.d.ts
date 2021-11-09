/* SystemJS module definition */
/*declare var module: NodeModule;
interface NodeModule {
  id: string;
}*/

// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;


// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;

declare module 'file-saver';

interface GlobalEnvironment {
  ENV;
  HMR;
}

declare var require: any;
