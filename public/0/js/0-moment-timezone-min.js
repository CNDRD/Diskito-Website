!function(t,e){"use strict";"object"==typeof module&&module.exports?module.exports=e(require("moment")):"function"==typeof define&&define.amd?define(["moment"],e):e(t.moment)}(this,function(s){"use strict";void 0===s.version&&s.default&&(s=s.default);var e,i={},f={},u={},a={},c={};s&&"string"==typeof s.version||D("Moment Timezone requires Moment.js. See https://momentjs.com/timezone/docs/#/use-it/browser/");var t=s.version.split("."),n=+t[0],o=+t[1];function l(t){return 96<t?t-87:64<t?t-29:t-48}function r(t){var e=0,n=t.split("."),o=n[0],r=n[1]||"",s=1,i=0,f=1;for(45===t.charCodeAt(0)&&(f=-(e=1));e<o.length;e++)i=60*i+l(o.charCodeAt(e));for(e=0;e<r.length;e++)s/=60,i+=l(r.charCodeAt(e))*s;return i*f}function h(t){for(var e=0;e<t.length;e++)t[e]=r(t[e])}function p(t,e){for(var n=[],o=0;o<e.length;o++)n[o]=t[e[o]];return n}function m(t){var e=t.split("|"),n=e[2].split(" "),o=e[3].split(""),r=e[4].split(" ");return h(n),h(o),h(r),function(t,e){for(var n=0;n<e;n++)t[n]=Math.round((t[n-1]||0)+6e4*t[n]);t[e-1]=1/0}(r,o.length),{name:e[0],abbrs:p(e[1].split(" "),o),offsets:p(n,o),untils:r,population:0|e[5]}}function d(t){t&&this._set(m(t))}function z(t,e){this.name=t,this.zones=e}function v(t){var e=t.toTimeString(),n=e.match(/\([a-z ]+\)/i);"GMT"===(n=n&&n[0]?(n=n[0].match(/[A-Z]/g))?n.join(""):void 0:(n=e.match(/[A-Z]{3,5}/g))?n[0]:void 0)&&(n=void 0),this.at=+t,this.abbr=n,this.offset=t.getTimezoneOffset()}function b(t){this.zone=t,this.offsetScore=0,this.abbrScore=0}function g(){for(var t,e,n=(new Date).getFullYear()-2,o=new v(new Date(n,0,1)),r=[o],s=1;s<48;s++)(e=new v(new Date(n,s,1))).offset!==o.offset&&(t=function(t,e){for(var n,o;o=6e4*((e.at-t.at)/12e4|0);)(n=new v(new Date(t.at+o))).offset===t.offset?t=n:e=n;return t}(o,e),r.push(t),r.push(new v(new Date(t.at+6e4)))),o=e;for(s=0;s<4;s++)r.push(new v(new Date(n+s,0,1))),r.push(new v(new Date(n+s,6,1)));return r}function _(t,e){return t.offsetScore!==e.offsetScore?t.offsetScore-e.offsetScore:t.abbrScore!==e.abbrScore?t.abbrScore-e.abbrScore:t.zone.population!==e.zone.population?e.zone.population-t.zone.population:e.zone.name.localeCompare(t.zone.name)}function w(){try{var t=Intl.DateTimeFormat().resolvedOptions().timeZone;if(t&&3<t.length){var e=a[y(t)];if(e)return e;D("Moment Timezone found "+t+" from the Intl api, but did not have that data loaded.")}}catch(t){}for(var n,o,r=g(),s=r.length,i=function(t){for(var e,n,o=t.length,r={},s=[],i=0;i<o;i++)for(e in n=c[t[i].offset]||{})n.hasOwnProperty(e)&&(r[e]=!0);for(i in r)r.hasOwnProperty(i)&&s.push(a[i]);return s}(r),f=[],u=0;u<i.length;u++){for(n=new b(S(i[u])),o=0;o<s;o++)n.scoreOffsetAt(r[o]);f.push(n)}return f.sort(_),0<f.length?f[0].zone.name:void 0}function y(t){return(t||"").toLowerCase().replace(/\//g,"_")}function O(t){var e,n,o,r;for("string"==typeof t&&(t=[t]),e=0;e<t.length;e++)r=y(n=(o=t[e].split("|"))[0]),i[r]=t[e],a[r]=n,function(t,e){var n,o;for(h(e),n=0;n<e.length;n++)o=e[n],c[o]=c[o]||{},c[o][t]=!0}(r,o[2].split(" "))}function S(t,e){t=y(t);var n,o=i[t];return o instanceof d?o:"string"==typeof o?(o=new d(o),i[t]=o):f[t]&&e!==S&&(n=S(f[t],S))?((o=i[t]=new d)._set(n),o.name=a[t],o):null}function M(t){var e,n,o,r;for("string"==typeof t&&(t=[t]),e=0;e<t.length;e++)o=y((n=t[e].split("|"))[0]),r=y(n[1]),f[o]=r,a[o]=n[0],f[r]=o,a[r]=n[1]}function j(t){return j.didShowError||(j.didShowError=!0,D("moment.tz.zoneExists('"+t+"') has been deprecated in favor of !moment.tz.zone('"+t+"')")),!!S(t)}function A(t){var e="X"===t._f||"x"===t._f;return!(!t._a||void 0!==t._tzm||e)}function D(t){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(t)}function T(t){var e=Array.prototype.slice.call(arguments,0,-1),n=arguments[arguments.length-1],o=S(n),r=s.utc.apply(null,e);return o&&!s.isMoment(t)&&A(r)&&r.add(o.parse(r),"minutes"),r.tz(n),r}(n<2||2==n&&o<6)&&D("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js "+s.version+". See momentjs.com"),d.prototype={_set:function(t){this.name=t.name,this.abbrs=t.abbrs,this.untils=t.untils,this.offsets=t.offsets,this.population=t.population},_index:function(t){for(var e=+t,n=this.untils,o=0;o<n.length;o++)if(e<n[o])return o},countries:function(){var e=this.name;return Object.keys(u).filter(function(t){return-1!==u[t].zones.indexOf(e)})},parse:function(t){for(var e,n,o,r=+t,s=this.offsets,i=this.untils,f=i.length-1,u=0;u<f;u++)if(e=s[u],n=s[u+1],o=s[u?u-1:u],e<n&&T.moveAmbiguousForward?e=n:o<e&&T.moveInvalidForward&&(e=o),r<i[u]-6e4*e)return s[u];return s[f]},abbr:function(t){return this.abbrs[this._index(t)]},offset:function(t){return D("zone.offset has been deprecated in favor of zone.utcOffset"),this.offsets[this._index(t)]},utcOffset:function(t){return this.offsets[this._index(t)]}},b.prototype.scoreOffsetAt=function(t){this.offsetScore+=Math.abs(this.zone.utcOffset(t.at)-t.offset),this.zone.abbr(t.at).replace(/[^A-Z]/g,"")!==t.abbr&&this.abbrScore++},T.version="0.5.33",T.dataVersion="",T._zones=i,T._links=f,T._names=a,T._countries=u,T.add=O,T.link=M,T.load=function(t){O(t.zones),M(t.links),function(t){var e,n,o,r;if(t&&t.length)for(e=0;e<t.length;e++)n=(r=t[e].split("|"))[0].toUpperCase(),o=r[1].split(" "),u[n]=new z(n,o)}(t.countries),T.dataVersion=t.version},T.zone=S,T.zoneExists=j,T.guess=function(t){return e&&!t||(e=w()),e},T.names=function(){var t,e=[];for(t in a)a.hasOwnProperty(t)&&(i[t]||i[f[t]])&&a[t]&&e.push(a[t]);return e.sort()},T.Zone=d,T.unpack=m,T.unpackBase60=r,T.needsOffset=A,T.moveInvalidForward=!0,T.moveAmbiguousForward=!1,T.countries=function(){return Object.keys(u)},T.zonesForCountry=function(t,e){var n;if(n=(n=t).toUpperCase(),!(t=u[n]||null))return null;var o=t.zones.sort();return e?o.map(function(t){return{name:t,offset:S(t).utcOffset(new Date)}}):o};var x,C=s.fn;function Z(t){return function(){return this._z?this._z.abbr(this):t.call(this)}}function k(t){return function(){return this._z=null,t.apply(this,arguments)}}s.tz=T,s.defaultZone=null,s.updateOffset=function(t,e){var n,o,r=s.defaultZone;void 0===t._z&&(r&&A(t)&&!t._isUTC&&(t._d=s.utc(t._a)._d,t.utc().add(r.parse(t),"minutes")),t._z=r),t._z&&(o=t._z.utcOffset(t),Math.abs(o)<16&&(o/=60),void 0!==t.utcOffset?(n=t._z,t.utcOffset(-o,e),t._z=n):t.zone(o,e))},C.tz=function(t,e){if(t){if("string"!=typeof t)throw new Error("Time zone name must be a string, got "+t+" ["+typeof t+"]");return this._z=S(t),this._z?s.updateOffset(this,e):D("Moment Timezone has no data for "+t+". See http://momentjs.com/timezone/docs/#/data-loading/."),this}if(this._z)return this._z.name},C.zoneName=Z(C.zoneName),C.zoneAbbr=Z(C.zoneAbbr),C.utc=k(C.utc),C.local=k(C.local),C.utcOffset=(x=C.utcOffset,function(){return 0<arguments.length&&(this._z=null),x.apply(this,arguments)}),s.tz.setDefault=function(t){return(n<2||2==n&&o<9)&&D("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js "+s.version+"."),s.defaultZone=t?S(t):null,s};var F=s.momentProperties;return"[object Array]"===Object.prototype.toString.call(F)?(F.push("_z"),F.push("_a")):F&&(F._z=null),s});
