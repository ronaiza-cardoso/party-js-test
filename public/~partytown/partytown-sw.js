const e=new Map,t=(e,t)=>({B:e.B,l:t}),r=(e,t)=>new Response(e,{headers:{"content-type":t||"text/html","Cache-Control":"no-store"}});self.oninstall=()=>self.skipWaiting(),self.onactivate=()=>self.clients.claim(),self.onmessage=t=>{const r=t.data,n=e.get(r.B);n&&(e.delete(r.B),clearTimeout(n[1]),n[0](r))},self.onfetch=n=>{const s=n.request,o=new URL(s.url).pathname;o.endsWith("partytown-sandbox-sw.html")?n.respondWith(r('<!DOCTYPE html><html><head><meta charset="utf-8"><script type="module">(e=>{const t=()=>{},r=e=>e.length,n=e=>e&&e.constructor&&e.constructor.name||"",s=(e,t)=>e.startsWith(t),i=e=>!(s(e,"webkit")||s(e,"toJSON")||s(e,"on")&&e.toLowerCase()===e),o=()=>Math.round(9999999999*Math.random()+4),a=new WeakMap,c=[],u=new Map,l={},d=new WeakMap,h=(e,t,r)=>e?e===e.window?0:"#document"===(r=e.nodeName)?1:"HTML"===r?2:"HEAD"===r?3:"BODY"===r?4:("number"!=typeof(t=a.get(e))&&f(e,t=o()),t):-1,p=(e,t,r)=>{const n=l[e].K,s=n.document;return 0===t?n:1===t?s:2===t?s.documentElement:3===t?s.head:4===t?s.body:(r=c.find((e=>e[0]===t)))?r[1]:void 0},f=(e,t)=>{e&&(c.push([t,e]),a.set(e,t))},m=(e,t,r,s,i)=>{if(void 0!==t){if("string"==(s=typeof t)||"number"===s||"boolean"===s||null==t)return[5,t];if("function"===s)return[2];if(r=r||new Set,Array.isArray(t))return r.has(t)?[0,[]]:(r.add(t),[0,t.map((t=>m(e,t,r)))]);if("object"===s)return t.nodeType?[3,{N:e,t:t.nodeType,s:h(t),C:t.nodeName}]:"Window"===(i=n(t))?[3,{N:e,t:0,s:0}]:"HTMLCollection"===i||"NodeList"===i?[3,{N:e,t:21,i:Array.from(t).map((t=>m(e,t,r)[1]))}]:"Event"===i?[1,$(e,t,r)]:"CSSStyleDeclaration"===i?[4,$(e,t,r)]:[4,$(e,t,r,!0,!0)]}},$=(e,t,r,n,s,o,a,c)=>{if(o={},!r.has(t))for(a in r.add(t),t)c=t[a],i(a)&&(n||"function"!=typeof c)&&(s||""!==c)&&(o[a]=m(e,c,r));return o},g=(e,t,r,n)=>{if(t){if(r=t[0],n=t[1],5===r)return n;if(6===r)return y(e,n);if(0===r)return n.map((t=>g(e,t)));if(3===r)return p(n.N,n.s);if(1===r)return w(T(e,n));if(4===r)return T(e,n)}},y=(e,{N:t,s:r,F:n})=>{let s=u.get(n);return s||(s=function(...s){const i={s:r,F:n,I:m(t,this),b:m(t,s)};e.postMessage([7,i])},u.set(n,s)),s},w=e=>new("detail"in e?CustomEvent:Event)(e.type,e),T=(e,t,r,n)=>{for(n in r={},t)r[n]=g(e,t[n]);return r},E=(e,t,n)=>{let s,i,o,a=0,c=r(n);for(;a<c;a++)i=n[a],s=n[a+1],o=n[a-1],Array.isArray(s)||("string"==typeof i?t=t[i]:0===s?t[o]=g(e,i):"function"==typeof t[o]&&(t=t[o].apply(t,g(e,i))));return t},L=(e,t)=>{let n,s,i=t.N,o=t.K,a=o.document,c=a.querySelector(\'script[type="text/partytown"]:not([data-ptid]):not([data-pterror]):not([async]):not([defer])\');c||(c=a.querySelector(\'script[type="text/partytown"]:not([data-ptid]):not([data-pterror])\')),c?(c.dataset.ptid=n=h(c,i),s={N:i,s:n},c.src?s.J=c.src:s.f=c.innerHTML,e.postMessage([6,s])):t.u||(t.u=1,((e,t,n)=>{let s=n._ptf,i=n._ptf=[],o=0;if(i.push=(r,n)=>e.postMessage([8,{N:t,s:0,m:r,b:m(t,Array.from(n))}]),s)for(;o<r(s);o+=2)i.push(s[o],s[o+1])})(e,i,o),a.dispatchEvent(new CustomEvent("pt0")),e.postMessage([4,i]))},M=(e,t,r,n)=>{if(!d.has(r)){d.set(r,t);const s=r.document,i=s.baseURI,o={N:t,D:d.get(r.parent),w:n,J:i},a=()=>e.postMessage([3,o]);l[t]={N:t,K:r,J:i},"complete"===s.readyState?a():r.addEventListener("load",a)}};(async e=>{let s;const a=e.parent;await(async(e,t)=>{const n=e.navigator.serviceWorker,i=await n.getRegistration(),o=e=>{i&&i.active&&i.active.postMessage(e)};return n.addEventListener("message",(e=>{return t=e.data,n=o,(async(e,t)=>{const n={B:t.B},s=[];for(const r of t.$tasks$)try{let t,s,o=r.N,a=r.s,c=r.a;if(l[o]||await new Promise((e=>{let t=0,r=()=>{l[o]||t++>999?e():setTimeout(r,9)};r()})),1===c[0]){const t=new l[o].K[c[1]](...g(e,c[2]));f(t,a)}else t=p(o,a),t?(s=E(e,t,c),r.c&&f(s,r.c),"object"==typeof(i=s)&&i&&i.then&&(s=await s,n.v=!0),n.G=m(o,s)):n.l=a+" not found"}catch(e){s.push(String(e.stack||e))}var i;return r(s)&&(n.l=s.join("\\n")),n})(s,t).then(n);var t,n})),!!i})(e)&&(s=new Worker(URL.createObjectURL(new Blob([\'(e=>{const t=Symbol(),r=Symbol(),n=Symbol(),s=Symbol(),i={},o=new WeakMap,a={},c={},$={},l=e=>e.toUpperCase(),u=e=>e.length,d=(e,t)=>Object.defineProperty(e,"name",{value:t}),h=(e,t)=>setTimeout(e,t),p=[],m=()=>Math.round(9999999999*Math.random()+4),g="text/partytown",f=(e,t)=>w(e[r],t),w=(e,t,r)=>(r=a[e])?r[t]:void 0,y=(e,t,n)=>T(e[r],t,n),T=(e,t,r,n)=>{(n=a[e]||{})[t]=r,a[e]=n};class E{constructor(e,i,o,a){return this[t]=o,this[r]=i,this[s]=a,v(this[n]=e,this,[])}}const I=[],M=(e,i,o,a)=>{const c=e[r];if(I.push({N:e[t],s:c,t:e[n],C:e[s],a:i,c:a}),!o)return L(c,i);setTimeout((()=>L(c,i)),50)},L=(e,t)=>{if(u(I)){const r={B:m(),$tasks$:I.slice()};I.length=0;const n=((e,t)=>{const r=new XMLHttpRequest,n=e.y+"proxytown";return r.open("POST",n,!1),r.send(JSON.stringify(t)),JSON.parse(r.responseText)})(c,r),s=n.v,i=j(e,t,n.G);if(n.l){if(s)return Promise.reject(n.l);throw new Error(n.l)}return s?Promise.resolve(i):i}},b=(e,t)=>M(e,t),S=(e,t,r)=>{const n=k(e,r);M(e,[...t,n,0],!0)},x=(e,t,r,n)=>{const s=N.some((e=>t.includes(e)));return M(e,[...t,k(e,r)],s,n)},v=(t,r,n)=>!r||"object"!=typeof r&&"function"!=typeof r||String(r).includes("[native")?r:new Proxy(r,{get(r,s,i){if("symbol"==typeof s||Reflect.has(r,s))return Reflect.get(r,s,i);if(H(t,s)){if(Reflect.has(e,s))return Reflect.get(e,s,i);return r[s]}8!==t&&10!==t||(t=3);const o=[...n,String(s)],a=c.r.find((e=>e[0]===t));if(a){const e=a[2][((e,t)=>{for(t=u(e)-1;t>=0;t--)if("string"==typeof e[t])return e[t];return e[0]})(o)];if(13===e)return(...e)=>x(r,o,e);if(e>0)return v(e,r,[...o])}const $=f(r,o[0]);return"function"==typeof $?(...e)=>$.apply(r,e):b(r,o)},set:(e,r,s,i)=>("symbol"==typeof r||Reflect.has(e,r)?Reflect.set(e,r,s,i):H(t,r)?e[r]=s:S(e,[...n,r],s),!0),has:(e,r)=>0===t||Reflect.has(e,r)}),H=(e,t)=>0===e&&(!c.M.includes(t)||c.n.includes(t)),N=["addEventListener","createElement","setAttribute","setItem"],R=(e,t,r,n)=>new(A(e,n=3===e?"#text":8===e?"#comment":11===e?"#document-fragment":10===e?"html":n))(e,t,r,n),A=(t,r)=>1===t?P(r):t<=11?e.Node:E,P=e=>O[e]||O.UNKNOWN,O={};class NodeList{constructor(e){(this._=e).map(((e,t)=>this[t]=e))}entries(){return this._.entries()}forEach(e,t){this._.map(e,t)}item(e){return this[e]}keys(){return this._.keys()}get length(){return u(this._)}values(){return this._.values()}[Symbol.iterator](){return this._[Symbol.iterator]()}}const W=(e,a,c,$)=>{if(void 0!==c){let d=typeof c;if("string"===d||"boolean"===d||"number"===d||null==c)return[5,c];if("function"===d)return[6,{N:e,s:a,F:(l=c,(u=o.get(l))||(o.set(l,u=m()),i[u]=l),u)}];if($=$||new Set,Array.isArray(c))return $.has(c)?[0,[]]:[0,c.map((t=>W(e,a,t,$)))];if("object"===d)return"number"==typeof c[r]?[3,{N:c[t],t:c[n],s:c[r],C:c[s]}]:c instanceof Event?[1,C(e,a,c,!1,$)]:[4,C(e,a,c,!0,$)]}var l,u},C=(e,t,r,n,s,i,o,a)=>{if(i={},!s.has(r))for(o in s.add(r),r)a=r[o],(n||"function"!=typeof a)&&(i[o]=W(e,t,a,s));return i},k=(e,n)=>e?W(e[t],e[r],n):[5,n],j=(e,t,r,n,s)=>{if(r){if(n=r[0],s=r[1],5===n)return s;if(6===n)return D(e,t,s);if(3===n)return B(s);if(0===n)return s.map((r=>j(e,t,r)));if(1===n)return i=U(e,t,s),new Proxy(new Event(i.type,i),{get:(e,t)=>t in i?i[t]:e[String(t)]});if(4===n)return U(e,t,s)}var i},U=(e,t,r,n,s)=>{for(s in n={},r)n[s]=j(e,[...t,s],r[s]);return n},B=({t:e,s:t,N:r,C:n,i:s})=>{const i=$[r];return 0===t?i.K:1===t?i.j:2===t?i.k:3===t?i.o:4===t?i.d:21===e?new NodeList(s.map(B)):R(e,t,r,n)},D=(e,t,{N:r,F:n})=>(i[n]||o.set(i[n]=function(...n){const s=R(0,e,r);return x(s,t,n)},n),i[n]),F=(e,t,r,n)=>{let s="";try{e.g=t,e.h="",e.H(r)}catch(e){console.error(r,e),s=String(e.stack||e)+""}return e.g=-1,e.h="",s},_=(e,t,r)=>{(r=w(e,t))&&h((()=>r.map((e=>e({type:t})))))},z=(e,t,r)=>{for(r=e.z;!r.host&&(r=(e=$[e.D]).z,!e.w););return new URL(t||"",r)},G=(e,t)=>z(e,t)+"",J=e=>z(Z(e),f(e,3)),V=()=>`<script src=${JSON.stringify(c.y+"partytown.js")} async defer><\\\\/script>`;class Node extends E{appendChild(e){return this.insertBefore(e,null)}get ownerDocument(){return Z(this).j}get href(){}set href(e){}insertBefore(e,n){const i=e[t]=this[t],o=e[r],a=e[s],l="SCRIPT"===a,u="IFRAME"===a;if(l){const t=f(e,2);if(t){const r=F(Z(e),o,t),n=r?"pterror":"ptid",s=r||o;S(e,["type"],g+"-x"),S(e,["dataset",n],s),S(e,["innerHTML"],t)}}return e=x(this,["insertBefore"],[e,n]),u&&(e=>{let t=0;const n=e[r],s=()=>{if($[n]&&$[n].u){let t=f(e,1)?"error":"load",r=f(e,t);r&&r.map((e=>e({type:t})))}else if(t++>2e3){let t=f(e,"error");t&&t.map((e=>e({type:"error"}))),console.error("Timeout")}else setTimeout(s,9)};s()})(e),l&&c.E([6,i]),e}get nodeName(){return this[s]}get nodeType(){return this[n]}}class HTMLElement extends Node{get localName(){return this.nodeName.toLowerCase()}get namespaceURI(){return"http://www.w3.org/1999/xhtml"}get tagName(){return this.nodeName}}class q extends HTMLElement{addEventListener(...e){let t=e[0],r=f(this,t)||[];r.push(e[1]),y(this,t,r)}get async(){return!0}set async(e){}get defer(){return!0}set defer(e){}get onload(){let e=f(this,"load");return e&&e[0]||null}set onload(e){y(this,"load",e?[e]:null)}get onerror(){let e=f(this,"error");return e&&e[0]||null}set onerror(e){y(this,"error",e?[e]:null)}}class HTMLDocument extends HTMLElement{get body(){return Z(this).d}createElement(e){e=l(e);const r=this[t],n=m(),s=new(P(e))(1,n,r,e);return x(this,["createElement"],[e],n),"IFRAME"===e?(Q({N:n,D:r,J:"about:blank"}),S(s,["srcdoc"],V())):"SCRIPT"===e&&S(s,["type"],g),s}createEvent(e){return new Event(e)}get currentScript(){const e=Z(this).g;return e>0?R(1,e,this[t],"SCRIPT"):null}get defaultView(){return ee(this)}get documentElement(){return Z(this).k}getElementsByTagName(e){return"BODY"===(e=l(e))?[this.body]:"HEAD"===e?[this.head]:x(this,["getElementsByTagName"],[e])}get head(){return Z(this).o}get implementation(){return{hasFeature:()=>!0}}get location(){return Z(this).z}set location(e){Z(this).z.href=e+""}get parentNode(){return null}get parentElement(){return null}get readyState(){return"complete"}}const X=(e,t,r,n)=>new(d(class extends HTMLElement{get parentElement(){return n}get parentNode(){return n}},`HTML${r}Element`))(1,t,e,l(r)),Y=e=>class{constructor(){this.s="",this.l=[],this.e=[]}get src(){return this.s}set src(t){const r=$[e];fetch(G(r,t),{mode:"no-cors",keepalive:!0}).then((e=>{e.ok?this.l.map((e=>e({type:"load"}))):this.e.map((e=>e({type:"error"})))}),(()=>this.e.forEach((e=>e({type:"error"})))))}addEventListener(e,t){"load"===e&&this.l.push(t),"error"===e&&this.e.push(t)}get onload(){return this.l[0]}set onload(e){this.l=[e]}get onerror(){return this.e[0]}set onerror(e){this.e=[e]}};class K extends URL{assign(){}reload(){}replace(){}}const Q=({N:s,D:i,w:o,J:a})=>{if($[s])$[s].z.href=a;else{class Window{constructor(){return y(this),v(0,this,[])}get document(){return l}get frameElement(){if(o)return null;const e=Z(this),r=this[t],n=e.D;return R(1,r,n,"IFRAME")}get globalThis(){return ee(this)}get location(){return g}set location(e){g.href=e+""}get parent(){return $[i].K}get self(){return ee(this)}get top(){for(const e in $)if($[e].w)return $[e].K}get window(){return ee(this)}}const l=new HTMLDocument(9,1,s,"#document"),u=new O.HTML(1,2,s,"HTML"),h=X(s,3,"Head",u),p=X(s,4,"Body",u),g=new K(a),f="addEventListener,removeEventListener,dispatchEvent,postMessage".split(","),w="devicePixelRatio,innerHeight,innerWidth,onmessage,onload,onerror".split(","),y=i=>{i[t]=s,i[r]=i[n]=0;for(const t in e)"function"!=typeof e[t]||t in i||(i[t]=e[t].bind(e));Object.getOwnPropertyNames(e).map((t=>{t in i||(i[t]=e[t])})),Object.keys(O).map((e=>i[O[e].name]=O[e])),c.M.map((e=>{const t=c.L[e],r=13===t;!(r||t>11)||e in i&&!f.includes(e)||(i[e]=r?(...t)=>x(i,[e],t):v(t,i,["window",e]))})),c.r.map((e=>{const t=e[0],r=e[1];i[r]=((e,t,r)=>d(class{constructor(...n){const s=m(),i=new E(t,s,e);return M(i,[1,r,W(e,s,n)]),i}},r))(s,t,r)})),i.Image=Y(s),i.Window=Window,i.performance=e.performance,i.name=name+s,i.navigator=(t=>{const r=e.navigator;return r.sendBeacon=(e,r)=>{const n=$[t];try{return fetch(G(n,e),{method:"POST",body:r,mode:"no-cors",keepalive:!0}),!0}catch(e){return console.error(e),!1}},r})(s),w.map((e=>Object.defineProperty(i,e,{get:()=>b(T,[e]),set:t=>S(T,[e],t)})))},T=new Window;$[s]={N:s,D:i,K:T,j:l,k:u,o:h,d:p,z:g,w:o,H:e=>{new Function(`with(this){${e}}`).apply(T)}}}c.E([6,s])},Z=e=>$[e[t]],ee=e=>Z(e).K;class HTMLAnchorElement extends HTMLElement{get hash(){return J(this).hash}get host(){return J(this).host}get hostname(){return J(this).hostname}get href(){return J(this)+""}set href(e){y(this,3,e+=""),S(this,["href"],e)}get origin(){return J(this).origin}get pathname(){return J(this).pathname}get port(){return J(this).port}get protocol(){return J(this).protocol}get search(){return J(this).search}}class te extends HTMLElement{getContext(...e){return v(14,this,["getContext",k(this,e)])}}class HTMLIFrameElement extends q{get contentDocument(){return this.contentWindow.document}get contentWindow(){const e=this[r];return $[e].K}get src(){return f(this,3)||""}set src(e){let t,r=new XMLHttpRequest;e=G(Z(this),e),y(this,1,void 0),y(this,3,e),r.open("GET",e,!1),r.send(),t=r.status,t>199&&t<300?S(this,["srcdoc"],((e,t)=>`<base href="${e}">`+t.replace(/<script>/g,\\\'<script type="text/partytown">\\\').replace(/<script /g,\\\'<script type="text/partytown" \\\').replace(/text\\\\/javascript/g,g)+V())(e,r.responseText)):y(this,1,t)}}class HTMLScriptElement extends q{get innerHTML(){return f(this,2)||""}set innerHTML(e){y(this,2,e)}get innerText(){return this.innerHTML}set innerText(e){this.innerHTML=e}get src(){return f(this,3)||""}set src(e){e=G(Z(this),e),y(this,3,e),S(this,["src"],e)}get textContent(){return this.innerHTML}set textContent(e){this.innerHTML=e}get type(){return b(this,["type"])}set type(e){"text/javascript"!==e&&S(this,["type"],e)}}const re=Symbol();class ne extends HTMLElement{get sheet(){const e=this;if(void 0===e[re]){const t=b(e,["sheet"]);if(null===t)e[re]=t;else{class r{get cssRules(){return t.cssRules}deleteRule(t){e[re]=void 0,x(e,["sheet","deleteRule"],[t])}insertRule(t,r){return e[re]=void 0,x(e,["sheet","insertRule"],[t,r])}}e[re]=new r}}return e[re]}}const se=[],ie=t=>{const r=t.data,n=r[0];var s;c.u?6===n?(async t=>{let r,n,s=t.N,i=t.s,o=t.f,a=t.J,l="",u=$[s];if(a)try{if(n=z(u,a),a=n+"",T(i,3,a),n.origin!==origin)try{await e.fetch(a,{method:"OPTIONS"})}catch(e){a="https://partytown.builder.io/api/proxy?p="+a}r=await e.fetch(a),r.ok?(o=await r.text(),u.g=i,u.h=a,u.H(o),_(i,"load")):(console.error(r.status,"url:",a),l=r.statusText,_(i,"error"))}catch(e){console.error("url:",a,e),l=String(e.stack||e)+"",_(i,"error")}else o&&(l=F(u,i,o));u.g=-1,u.h="",c.E([5,s,i,l])})(r[1]):7===n?(({s:e,F:t,I:r,b:n})=>{if(i[t])try{const s=j(e,[],r),o=j(e,[],n);i[t].apply(s,o)}catch(e){console.error(e)}})(r[1]):8===n?(({N:t,s:r,m:n,b:s})=>{try{const i=$[t].K,o=n[0]in i?i:n[0]in e?e:{},a=j(r,[],s),c=o[n[0]];Array.isArray(c)?c.push(...a):"function"==typeof c&&c.apply(o,a)}catch(e){console.error(e)}})(r[1]):3===n?Q(r[1]):4===n&&($[r[1]].u=1):1===n?(s=r[1],Object.assign(c,s),c.n=(c.e.forward||p).map((e=>e[0])),c.L=c.r[0][2],c.M=Object.keys(c.L).filter((e=>!c.n.includes(e))),c.E=postMessage.bind(e),e.postMessage=e.importScripts=void 0,e.Node=Node,e.Element=e.HTMLElement=q,e.Document=HTMLDocument,c.p.map((e=>{return O[(t=e,{IMAGE:"IMG",OLIST:"OL",PARAGRAPH:"P",TABLECELL:"TD",TABLEROW:"TR",ULIST:"UL"}[t=l(t.substr(4).replace("Element",""))]||t)]=d(class extends HTMLElement{},e);var t})),O.A=HTMLAnchorElement,O.CANVAS=te,O.IFRAME=HTMLIFrameElement,O.SCRIPT=HTMLScriptElement,O.STYLE=ne,c.u=1,c.E([2]),h((()=>{se.slice().forEach(ie),se.length=0}))):se.push(t)};e.onmessage=ie,postMessage([0])})(self);\\n\'],{type:"text/javascript"})),{name:"Partytown 🎉"}),s.onmessage=e=>((e,r,s)=>{const a=s[0];if(0===a){const s=(e=>{const r=e.document,s=e.partytown||{},o=(s.lib||"/~partytown/")+"",a=e.location+"",c=r.implementation.createHTMLDocument(),u=c.createElement("input"),l=c.createElement("canvas").getContext("2d"),d=[[0,e],[15,u.style],[9,c],[11,c.createDocumentFragment()],[16,u.dataset],[17,u.classList],[1,u],[14,l],[18,e.history],[19,e.location],[20,new MutationObserver(t)],[22,u.attributes],[21,u.childNodes],[23,new ResizeObserver(t)],[24,e.screen],[25,e.localStorage],[3,c.createTextNode("")]].map((e=>[...e,n(e[1])]));return{e:s,y:new URL(o,a)+"",p:Object.getOwnPropertyNames(e).filter((e=>/^H.*t$/i.test(e))),r:d.map((([e,t,r])=>{let s,o,a,c,u,l=[e,r,{}];for(s in t)i(s)&&(o=t[s],a=typeof o,"function"===a?l[2][s]=13:"object"===a&&(c=n(o),u=d.find((e=>e[2]===c)),u&&(l[2][s]=u[0])));return l}))}})(r);e.postMessage([1,s])}else if(2===a)M(e,o(),r,1);else{const t=l[s[1]];t&&(6===a?L(e,t):5===a&&((e,t,r,n,s)=>{(s=t.K.document.querySelector(`[data-ptid="${r}"]`))&&(n?s.dataset.pterror=n:s.type+="-x"),L(e,t)})(e,t,s[2],s[3]))}})(s,a,e.data),a.addEventListener("pt1",(e=>{const t=e.detail,r=h(t.frameElement);M(s,r,t)})))})(e)})(window);\n<\/script></head></html>')):o.endsWith("proxytown")&&n.respondWith((n=>new Promise((async s=>{const o=await n.clone().json(),i=await(r=>new Promise((async n=>{const s=[...await self.clients.matchAll()].sort(((e,t)=>e.url>t.url?-1:e.url<t.url?1:0))[0];if(s){const o=[n,setTimeout((()=>{e.delete(r.B),n(t(r,"Timeout"))}),1e4)];e.set(r.B,o),s.postMessage(r)}else n(t(r,"No Party"))})))(o);s(r(JSON.stringify(i),"application/json"))})))(s))};