// MINIFIED VERSION OF THE FILE OF THE SAME NAME IN THE `src` FOLDER
// MINIFIED WITH https://www.toptal.com/developers/javascript-minifier
// MINIFIED AT Sat Apr 19 17:08:14 CDT 2025

export class x2x8{constructor(){this.progress=0}to2(r){this.progress=0;var t="",s=0;for(var e of r){var o=Number.parseInt(e,8).toString(2);t+=o=o.padStart(3,"0"),this.progress=s/r.length,s++}return t.replace(/^0*1/,"")}to8(r){var t=3-r.length%3,s="0".repeat(t-1)+"1",e=this.splitIntoSizedSubstrings(s+r,3),o="",n=0;for(var a of e)o+=Number.parseInt(a,2).toString(8),this.progress=n/e.length,n++;return o}splitIntoSizedSubstrings(r,t){let s=RegExp(".{1,"+t+"}","g");return r.match(s)}}