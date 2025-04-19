// MINIFIED VERSION OF THE FILE OF THE SAME NAME IN THE `src` FOLDER
// MINIFIED WITH https://www.toptal.com/developers/javascript-minifier
// MINIFIED AT Sat Apr 19 17:08:14 CDT 2025

export class Provider{constructor(e){this.element=document.getElementById(e),this.serve}clear(){null!=this.serve&&URL.revokeObjectURL(this.serve),this.element.href=null,this.element.download=null,this.element.innerHTML="Processing... Please Wait..."}provide(e,t,r){var s=new Blob([r],{type:t});this.serve=URL.createObjectURL(s),this.element.href=this.serve,this.element.download=e,this.element.innerHTML=e}error(){this.clear(),this.element.innerHTML="Error. Process Aborted."}}