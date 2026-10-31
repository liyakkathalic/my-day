(()=>{var Mt,x,Zn,Xe,eo,qn,Es,xt={},to=[],Ns=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function Ee(e,t){for(var n in t)e[n]=t[n];return e}function no(e){var t=e.parentNode;t&&t.removeChild(e)}function oo(e,t,n){var o,a,s,r={};for(s in t)s=="key"?o=t[s]:s=="ref"?a=t[s]:r[s]=t[s];if(arguments.length>2&&(r.children=arguments.length>3?Mt.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(s in e.defaultProps)r[s]===void 0&&(r[s]=e.defaultProps[s]);return wt(e,r,o,a,null)}function wt(e,t,n,o,a){var s={type:e,props:t,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:a??++Zn};return x.vnode!=null&&x.vnode(s),s}function Ct(e){return e.children}function St(e,t){this.props=e,this.context=t}function He(e,t){if(t==null)return e.__?He(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?He(e):null}function ao(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return ao(e)}}function Wn(e){(!e.__d&&(e.__d=!0)&&Xe.push(e)&&!Dt.__r++||qn!==x.debounceRendering)&&((qn=x.debounceRendering)||eo)(Dt)}function Dt(){for(var e;Dt.__r=Xe.length;)e=Xe.sort(function(t,n){return t.__v.__b-n.__v.__b}),Xe=[],e.some(function(t){var n,o,a,s,r,l;t.__d&&(r=(s=(n=t).__v).__e,(l=n.__P)&&(o=[],(a=Ee({},s)).__v=s.__v+1,Gt(l,s,a,n.__n,l.ownerSVGElement!==void 0,s.__h!=null?[r]:null,o,r??He(s),s.__h),lo(o,s),s.__e!=r&&ao(s)))})}function so(e,t,n,o,a,s,r,l,d,u){var c,p,h,f,m,$,g,y=o&&o.__k||to,S=y.length;for(n.__k=[],c=0;c<t.length;c++)if((f=n.__k[c]=(f=t[c])==null||typeof f=="boolean"?null:typeof f=="string"||typeof f=="number"||typeof f=="bigint"?wt(null,f,null,null,f):Array.isArray(f)?wt(Ct,{children:f},null,null,null):f.__b>0?wt(f.type,f.props,f.key,null,f.__v):f)!=null){if(f.__=n,f.__b=n.__b+1,(h=y[c])===null||h&&f.key==h.key&&f.type===h.type)y[c]=void 0;else for(p=0;p<S;p++){if((h=y[p])&&f.key==h.key&&f.type===h.type){y[p]=void 0;break}h=null}Gt(e,f,h=h||xt,a,s,r,l,d,u),m=f.__e,(p=f.ref)&&h.ref!=p&&(g||(g=[]),h.ref&&g.push(h.ref,null,f),g.push(p,f.__c||m,f)),m!=null?($==null&&($=m),typeof f.type=="function"&&f.__k!=null&&f.__k===h.__k?f.__d=d=io(f,d,e):d=ro(e,f,h,y,m,d),u||n.type!=="option"?typeof n.type=="function"&&(n.__d=d):e.value=""):d&&h.__e==d&&d.parentNode!=e&&(d=He(h))}for(n.__e=$,c=S;c--;)y[c]!=null&&(typeof n.type=="function"&&y[c].__e!=null&&y[c].__e==n.__d&&(n.__d=He(o,c+1)),uo(y[c],y[c]));if(g)for(c=0;c<g.length;c++)co(g[c],g[++c],g[++c])}function io(e,t,n){var o,a;for(o=0;o<e.__k.length;o++)(a=e.__k[o])&&(a.__=e,t=typeof a.type=="function"?io(a,t,n):ro(n,a,a,e.__k,a.__e,t));return t}function ro(e,t,n,o,a,s){var r,l,d;if(t.__d!==void 0)r=t.__d,t.__d=void 0;else if(n==null||a!=s||a.parentNode==null)e:if(s==null||s.parentNode!==e)e.appendChild(a),r=null;else{for(l=s,d=0;(l=l.nextSibling)&&d<o.length;d+=2)if(l==a)break e;e.insertBefore(a,s),r=s}return r!==void 0?r:a.nextSibling}function Un(e,t,n){t[0]==="-"?e.setProperty(t,n):e[t]=n==null?"":typeof n!="number"||Ns.test(t)?n:n+"px"}function kt(e,t,n,o,a){var s;e:if(t==="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof o=="string"&&(e.style.cssText=o=""),o)for(t in o)n&&t in n||Un(e.style,t,"");if(n)for(t in n)o&&n[t]===o[t]||Un(e.style,t,n[t])}else if(t[0]==="o"&&t[1]==="n")s=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+s]=n,n?o||e.addEventListener(t,s?Vn:Hn,s):e.removeEventListener(t,s?Vn:Hn,s);else if(t!=="dangerouslySetInnerHTML"){if(a)t=t.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if(t!=="href"&&t!=="list"&&t!=="form"&&t!=="tabIndex"&&t!=="download"&&t in e)try{e[t]=n??"";break e}catch{}typeof n=="function"||(n!=null&&(n!==!1||t[0]==="a"&&t[1]==="r")?e.setAttribute(t,n):e.removeAttribute(t))}}function Hn(e){this.l[e.type+!1](x.event?x.event(e):e)}function Vn(e){this.l[e.type+!0](x.event?x.event(e):e)}function Gt(e,t,n,o,a,s,r,l,d){var u,c,p,h,f,m,$,g,y,S,R,_=t.type;if(t.constructor!==void 0)return null;n.__h!=null&&(d=n.__h,l=t.__e=n.__e,t.__h=null,s=[l]),(u=x.__b)&&u(t);try{e:if(typeof _=="function"){if(g=t.props,y=(u=_.contextType)&&o[u.__c],S=u?y?y.props.value:u.__:o,n.__c?$=(c=t.__c=n.__c).__=c.__E:("prototype"in _&&_.prototype.render?t.__c=c=new _(g,S):(t.__c=c=new St(g,S),c.constructor=_,c.render=Os),y&&y.sub(c),c.props=g,c.state||(c.state={}),c.context=S,c.__n=o,p=c.__d=!0,c.__h=[]),c.__s==null&&(c.__s=c.state),_.getDerivedStateFromProps!=null&&(c.__s==c.state&&(c.__s=Ee({},c.__s)),Ee(c.__s,_.getDerivedStateFromProps(g,c.__s))),h=c.props,f=c.state,p)_.getDerivedStateFromProps==null&&c.componentWillMount!=null&&c.componentWillMount(),c.componentDidMount!=null&&c.__h.push(c.componentDidMount);else{if(_.getDerivedStateFromProps==null&&g!==h&&c.componentWillReceiveProps!=null&&c.componentWillReceiveProps(g,S),!c.__e&&c.shouldComponentUpdate!=null&&c.shouldComponentUpdate(g,c.__s,S)===!1||t.__v===n.__v){c.props=g,c.state=c.__s,t.__v!==n.__v&&(c.__d=!1),c.__v=t,t.__e=n.__e,t.__k=n.__k,t.__k.forEach(function(H){H&&(H.__=t)}),c.__h.length&&r.push(c);break e}c.componentWillUpdate!=null&&c.componentWillUpdate(g,c.__s,S),c.componentDidUpdate!=null&&c.__h.push(function(){c.componentDidUpdate(h,f,m)})}c.context=S,c.props=g,c.state=c.__s,(u=x.__r)&&u(t),c.__d=!1,c.__v=t,c.__P=e,u=c.render(c.props,c.state,c.context),c.state=c.__s,c.getChildContext!=null&&(o=Ee(Ee({},o),c.getChildContext())),p||c.getSnapshotBeforeUpdate==null||(m=c.getSnapshotBeforeUpdate(h,f)),R=u!=null&&u.type===Ct&&u.key==null?u.props.children:u,so(e,Array.isArray(R)?R:[R],t,n,o,a,s,r,l,d),c.base=t.__e,t.__h=null,c.__h.length&&r.push(c),$&&(c.__E=c.__=null),c.__e=!1}else s==null&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=As(n.__e,t,n,o,a,s,r,d);(u=x.diffed)&&u(t)}catch(H){t.__v=null,(d||s!=null)&&(t.__e=l,t.__h=!!d,s[s.indexOf(l)]=null),x.__e(H,t,n)}}function lo(e,t){x.__c&&x.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(o){o.call(n)})}catch(o){x.__e(o,n.__v)}})}function As(e,t,n,o,a,s,r,l){var d,u,c,p=n.props,h=t.props,f=t.type,m=0;if(f==="svg"&&(a=!0),s!=null){for(;m<s.length;m++)if((d=s[m])&&(d===e||(f?d.localName==f:d.nodeType==3))){e=d,s[m]=null;break}}if(e==null){if(f===null)return document.createTextNode(h);e=a?document.createElementNS("http://www.w3.org/2000/svg",f):document.createElement(f,h.is&&h),s=null,l=!1}if(f===null)p===h||l&&e.data===h||(e.data=h);else{if(s=s&&Mt.call(e.childNodes),u=(p=n.props||xt).dangerouslySetInnerHTML,c=h.dangerouslySetInnerHTML,!l){if(s!=null)for(p={},m=0;m<e.attributes.length;m++)p[e.attributes[m].name]=e.attributes[m].value;(c||u)&&(c&&(u&&c.__html==u.__html||c.__html===e.innerHTML)||(e.innerHTML=c&&c.__html||""))}if(function($,g,y,S,R){var _;for(_ in y)_==="children"||_==="key"||_ in g||kt($,_,null,y[_],S);for(_ in g)R&&typeof g[_]!="function"||_==="children"||_==="key"||_==="value"||_==="checked"||y[_]===g[_]||kt($,_,g[_],y[_],S)}(e,h,p,a,l),c)t.__k=[];else if(m=t.props.children,so(e,Array.isArray(m)?m:[m],t,n,o,a&&f!=="foreignObject",s,r,s?s[0]:n.__k&&He(n,0),l),s!=null)for(m=s.length;m--;)s[m]!=null&&no(s[m]);l||("value"in h&&(m=h.value)!==void 0&&(m!==e.value||f==="progress"&&!m)&&kt(e,"value",m,p.value,!1),"checked"in h&&(m=h.checked)!==void 0&&m!==e.checked&&kt(e,"checked",m,p.checked,!1))}return e}function co(e,t,n){try{typeof e=="function"?e(t):e.current=t}catch(o){x.__e(o,n)}}function uo(e,t,n){var o,a;if(x.unmount&&x.unmount(e),(o=e.ref)&&(o.current&&o.current!==e.__e||co(o,null,t)),(o=e.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(s){x.__e(s,t)}o.base=o.__P=null}if(o=e.__k)for(a=0;a<o.length;a++)o[a]&&uo(o[a],t,typeof e.type!="function");n||e.__e==null||no(e.__e),e.__e=e.__d=void 0}function Os(e,t,n){return this.constructor(e,n)}function po(e,t,n){var o,a,s;x.__&&x.__(e,t),a=(o=typeof n=="function")?null:n&&n.__k||t.__k,s=[],Gt(t,e=(!o&&n||t).__k=oo(Ct,null,[e]),a||xt,xt,t.ownerSVGElement!==void 0,!o&&n?[n]:a?null:t.firstChild?Mt.call(t.childNodes):null,s,!o&&n?n:a?a.__e:t.firstChild,o),lo(s,e)}Mt=to.slice,x={__e:function(e,t){for(var n,o,a;t=t.__;)if((n=t.__c)&&!n.__)try{if((o=n.constructor)&&o.getDerivedStateFromError!=null&&(n.setState(o.getDerivedStateFromError(e)),a=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e),a=n.__d),a)return n.__E=n}catch(s){e=s}throw e}},Zn=0,St.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=Ee({},this.state),typeof e=="function"&&(e=e(Ee({},n),this.props)),e&&Ee(n,e),e!=null&&this.__v&&(t&&this.__h.push(t),Wn(this))},St.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Wn(this))},St.prototype.render=Ct,Xe=[],eo=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Dt.__r=0,Es=0;var It,de,jn,Tt=0,Jt=[],Yn=x.__b,zn=x.__r,Kn=x.diffed,Jn=x.__c,Qn=x.unmount;function Xt(e,t){x.__h&&x.__h(de,e,Tt||t),Tt=0;var n=de.__H||(de.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function v(e){return Tt=1,Ze(ho,e)}function Ze(e,t,n){var o=Xt(It++,2);return o.t=e,o.__c||(o.__=[n?n(t):ho(void 0,t),function(a){var s=o.t(o.__[0],a);o.__[0]!==s&&(o.__=[s,o.__[1]],o.__c.setState({}))}],o.__c=de),o.__}function z(e,t){var n=Xt(It++,3);!x.__s&&mo(n.__H,t)&&(n.__=e,n.__H=t,de.__H.__h.push(n))}function fo(e){return Tt=5,Rs(function(){return{current:e}},[])}function Rs(e,t){var n=Xt(It++,7);return mo(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function Ps(){Jt.forEach(function(e){if(e.__P)try{e.__H.__h.forEach(_t),e.__H.__h.forEach(Qt),e.__H.__h=[]}catch(t){e.__H.__h=[],x.__e(t,e.__v)}}),Jt=[]}x.__b=function(e){de=null,Yn&&Yn(e)},x.__r=function(e){zn&&zn(e),It=0;var t=(de=e.__c).__H;t&&(t.__h.forEach(_t),t.__h.forEach(Qt),t.__h=[])},x.diffed=function(e){Kn&&Kn(e);var t=e.__c;t&&t.__H&&t.__H.__h.length&&(Jt.push(t)!==1&&jn===x.requestAnimationFrame||((jn=x.requestAnimationFrame)||function(n){var o,a=function(){clearTimeout(s),Gn&&cancelAnimationFrame(o),setTimeout(n)},s=setTimeout(a,100);Gn&&(o=requestAnimationFrame(a))})(Ps)),de=void 0},x.__c=function(e,t){t.some(function(n){try{n.__h.forEach(_t),n.__h=n.__h.filter(function(o){return!o.__||Qt(o)})}catch(o){t.some(function(a){a.__h&&(a.__h=[])}),t=[],x.__e(o,n.__v)}}),Jn&&Jn(e,t)},x.unmount=function(e){Qn&&Qn(e);var t=e.__c;if(t&&t.__H)try{t.__H.__.forEach(_t)}catch(n){x.__e(n,t.__v)}};var Gn=typeof requestAnimationFrame=="function";function _t(e){var t=de;typeof e.__c=="function"&&e.__c(),de=t}function Qt(e){var t=de;e.__c=e.__(),de=t}function mo(e,t){return!e||e.length!==t.length||t.some(function(n,o){return n!==e[o]})}function ho(e,t){return typeof t=="function"?t(e):t}var yo=function(e,t,n,o){var a;t[0]=0;for(var s=1;s<t.length;s++){var r=t[s++],l=t[s]?(t[0]|=r?1:2,n[t[s++]]):t[++s];r===3?o[0]=l:r===4?o[1]=Object.assign(o[1]||{},l):r===5?(o[1]=o[1]||{})[t[++s]]=l:r===6?o[1][t[++s]]+=l+"":r?(a=e.apply(l,yo(e,l,n,["",null])),o.push(a),l[0]?t[0]|=2:(t[s-2]=0,t[s]=a)):o.push(l)}return o},Xn=new Map,i=(function(e){var t=Xn.get(this);return t||(t=new Map,Xn.set(this,t)),(t=yo(this,t.get(e)||(t.set(e,t=function(n){for(var o,a,s=1,r="",l="",d=[0],u=function(h){s===1&&(h||(r=r.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?d.push(0,h,r):s===3&&(h||r)?(d.push(3,h,r),s=2):s===2&&r==="..."&&h?d.push(4,h,0):s===2&&r&&!h?d.push(5,0,!0,r):s>=5&&((r||!h&&s===5)&&(d.push(s,0,r,a),s=6),h&&(d.push(s,h,0,a),s=6)),r=""},c=0;c<n.length;c++){c&&(s===1&&u(),u(c));for(var p=0;p<n[c].length;p++)o=n[c][p],s===1?o==="<"?(u(),d=[d],s=3):r+=o:s===4?r==="--"&&o===">"?(s=1,r=""):r=o+r[0]:l?o===l?l="":r+=o:o==='"'||o==="'"?l=o:o===">"?(u(),s=1):s&&(o==="="?(s=5,a=r,r=""):o==="/"&&(s<5||n[c][p+1]===">")?(u(),s===3&&(d=d[0]),s=d,(d=d[0]).push(2,0,s),s=0):o===" "||o==="	"||o===`
`||o==="\r"?(u(),s=2):r+=o),s===3&&r==="!--"&&(s=4,d=d[0])}return u(),d}(e)),t),arguments,[])).length>1?t:t[0]}).bind(oo);var Et=class extends Error{constructor(t,n){super(n),this.status=t}};async function V(e,{method:t="GET",body:n}={}){let o;try{o=await fetch(e,{method:t,credentials:"same-origin",headers:{"Content-Type":"application/json","X-MyDay":"1"},body:n===void 0?void 0:JSON.stringify(n),cache:"no-store"})}catch{throw new Et(0,"Could not reach the server. You may be offline.")}let a={};try{a=await o.json()}catch{}if(!o.ok)throw new Et(o.status,a.error||`Server error (${o.status})`);return a}var Zt="local",N=Zt==="artifact",ae=Zt==="local",ee=Zt==="cloud",De=N||ae||ee;var $o=null,en=null;async function vo(){let e=window.claude;if(!e?.use)return!1;try{let[t,n]=await Promise.all([e.use("db"),e.use("user")]);if(!t||!n)return!1;let o=await n.id();return o?($o=t,en=$o.collection(`data/users/${o}`),!0):!1}catch{return!1}}var Ls=(e,t)=>`${e}~${t}`,go=e=>({col:e.col,id:e.id,rev:e.rev||0,deleted:!!e.deleted,data:e.deleted?null:e.data??null});function ko(e,t){let n=!0;return en.onSnapshot(o=>{let a=[];for(let r of o.docChanges()){if(r.type==="removed")continue;let l=r.doc.data();l?.col&&l?.id&&a.push(go(l))}let s=n&&!o.metadata.fromCache;s&&(n=!1),e(a,s)},t)}async function bo(e){try{return await e()}catch(t){if(t?.code!=="unavailable")throw t;return await new Promise(n=>setTimeout(n,500+Math.random()*1e3)),e()}}async function wo(e){let t=[];for(let n of e){let o;try{o=en.doc(Ls(n.col,n.id))}catch{t.push({col:n.col,id:n.id,ok:!1,error:"Invalid item id"});continue}let a=await bo(()=>o.get()),s=a.exists?a.data():null,r=s?.rev||0;if(r!==n.baseRev){t.push({col:n.col,id:n.id,ok:!1,conflict:!0,server:s?go(s):null});continue}try{await bo(()=>o.set({col:n.col,id:n.id,rev:r+1,deleted:!!n.deleted,data:n.deleted?null:n.data,at:Date.now()})),t.push({col:n.col,id:n.id,ok:!0,rev:r+1})}catch(l){if(l?.code==="quota_exceeded")throw Object.assign(new Error("Your cloud storage is full. Delete old completed items or money entries, then try again."),{status:507});if(l?.code==="invalid_argument"){t.push({col:n.col,id:n.id,ok:!1,error:"This item could not be saved to the cloud."});continue}throw l}}return t}var Bs="myday",Nt,F=new Map,K=new Map,be=new Map,A={lastSeq:0,signedIn:!1,lastSyncAt:0,lastError:"",localOnlySince:0},tn=new Set,se={syncing:!1,online:navigator.onLine,ready:!1,cloudChecked:!N,passwordSet:!0},nn=new Map,tt,xo=new Promise(e=>{tt=e}),pe=(e,t)=>`${e}/${t}`,qs=e=>e==null?e:JSON.parse(JSON.stringify(e));function Ws(){return new Promise((e,t)=>{let n=indexedDB.open(Bs,1);n.onupgradeneeded=()=>{n.result.createObjectStore("records"),n.result.createObjectStore("meta")},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}function So(e){return new Promise((t,n)=>{let o=new Map,a=Nt.transaction(e).objectStore(e).openCursor();a.onsuccess=()=>{let s=a.result;s?(o.set(s.key,s.value),s.continue()):t(o)},a.onerror=()=>n(a.error)})}var on=new Set,an=!1;function fe(e=[]){e.forEach(t=>on.add(t)),an||(an=!0,queueMicrotask(At))}function At(){if(an=!1,!Nt)return Promise.resolve();let e=[...on];return on=new Set,new Promise((t,n)=>{let o=Nt.transaction(["records","meta"],"readwrite"),a=o.objectStore("records");for(let r of e){let l=F.get(r);l?a.put(l,r):a.delete(r)}let s=o.objectStore("meta");s.put(A,"meta"),s.put([...K],"outbox"),s.put([...be],"conflicts"),o.oncomplete=t,o.onerror=()=>n(o.error)})}function j(){for(let e of tn)e()}function Do(e){return tn.add(e),()=>tn.delete(e)}async function To(){Nt=await Ws();for(let[t,n]of await So("records"))F.set(t,n);let e=await So("meta");Object.assign(A,e.get("meta")||{});for(let[t,n]of e.get("outbox")||[])K.set(t,n);for(let[t,n]of e.get("conflicts")||[])be.set(t,n);if(A.localOnlySince||(A.localOnlySince=Date.now()),navigator.storage?.persist?.().catch(()=>{}),window.addEventListener("online",()=>{se.online=!0,j(),ie()}),window.addEventListener("offline",()=>{se.online=!1,j()}),document.addEventListener("visibilitychange",()=>{document.hidden||ie()}),setInterval(()=>{document.hidden||ie()},ee?4e3:6e4),N)A.signedIn=!1,Us();else if(ae)A.signedIn=!1,se.cloudChecked=!0;else try{let t=await V("/api/session");A.signedIn=t.signedIn,se.passwordSet=t.passwordSet!==!1}catch{}se.ready=!0,j()}function Te(e){let t=[];for(let n of F.values())n.col===e&&!n.deleted&&t.push({...n.data,id:n.id});return t}function ve(e,t){let n=F.get(pe(e,t));return n&&!n.deleted?{...n.data,id:t}:null}function Mo(e){let t=new Set;for(let n of F.values())n.col===e&&t.add(n.id);return t}var nt=(e,t)=>F.has(pe(e,t)),_o=null;function Co(){clearTimeout(_o),_o=setTimeout(ie,ee?400:1200)}function I(e,t,n,{gen:o=!1,force:a=!1}={}){let s=pe(e,t),r=F.get(s),l=qs(n);delete l.id,l.updatedAt=Date.now(),F.set(s,{col:e,id:t,rev:r?.rev||0,deleted:!1,data:l,lv:(r?.lv||0)+1,gen:o&&(!r||!!r.gen)});let d=K.get(s);K.set(s,{baseRev:d?d.baseRev:r?.rev||0,gen:d?d.gen&&o:o,force:a||d?.force||!1}),fe([s]),j(),Co()}function ge(e,t,{force:n=!1}={}){let o=pe(e,t),a=F.get(o);if(!a)return;F.set(o,{...a,deleted:!0,data:null,lv:(a.lv||0)+1});let s=K.get(o);K.set(o,{baseRev:s?s.baseRev:a.rev||0,gen:!1,force:n||s?.force||!1}),fe([o]),j(),Co()}var Io=(e,t)=>{let n=o=>{if(!o)return o;let{updatedAt:a,...s}=o;return JSON.stringify(s)};return n(e)===n(t)};function sn(e,t){let n=F.get(e);F.set(e,{col:t.col,id:t.id,rev:t.rev,deleted:t.deleted,data:t.data,lv:n?.lv||0}),K.delete(e),be.delete(e)}function rn(e,t){let n=K.get(e);if(!n){let a=F.get(e);return a&&a.rev===t.rev?void 0:sn(e,t)}if(nn.get(e)===t.rev||t.rev<=n.baseRev)return;let o=F.get(e);if(n.gen||o&&Io(o.data,t.data)&&!!o.deleted==!!t.deleted)return sn(e,t);if(n.force){n.baseRev=t.rev;return}be.set(e,{server:t})}var et=null;function ie(){return et||(!A.signedIn||!navigator.onLine?(j(),Promise.resolve()):(se.syncing=!0,j(),et=(async()=>{await null;try{for(let e=!N;e;){let t=await V(`/api/sync?since=${A.lastSeq}`);for(let n of t.records)rn(pe(n.col,n.id),n);fe(t.records.map(n=>pe(n.col,n.id))),A.lastSeq=t.seq,e=t.more}for(let e=0;e<3;e++){let t=[...K.keys()].filter(r=>!be.has(r)).slice(0,500);if(!t.length)break;let n=new Map(t.map(r=>[r,F.get(r)?.lv])),o=t.map(r=>{let l=F.get(r);return{col:l.col,id:l.id,baseRev:K.get(r).baseRev,deleted:!!l.deleted,data:l.deleted?void 0:l.data}});o.forEach(r=>nn.set(pe(r.col,r.id),r.baseRev+1));let a;try{a=N?await wo(o):(await V("/api/sync",{method:"POST",body:{changes:o}})).results}finally{o.forEach(r=>nn.delete(pe(r.col,r.id)))}let s=!1;if(a.forEach((r,l)=>{let d=t[l],u=F.get(d),c=K.get(d);if(!(!u||!c))if(r.ok)u.rev=r.rev,u.lv===n.get(d)?K.delete(d):c.baseRev=r.rev;else if(r.conflict){let p=r.server||{col:u.col,id:u.id,rev:0,deleted:!0,data:null};c.force?(c.baseRev=p.rev,s=!0):rn(d,p)}else A.lastError=r.error||"A change was rejected"}),fe(t),!s&&K.size===0)break}A.lastSyncAt=Date.now(),A.lastError=""}catch(e){e.status===401&&(A.signedIn=!1),A.lastError=e.status===0||e.code==="unavailable"?"":e.message||"Could not reach the cloud copy",e.code==="revoked"&&(A.signedIn=!1)}finally{se.syncing=!1,et=null,fe(),j()}})(),et))}async function Us(){let e=await vo();if(se.cloudChecked=!0,A.signedIn=e,j(),!e){tt(!1);return}ko((t,n)=>{for(let o of t)rn(pe(o.col,o.id),o);t.length&&fe(t.map(o=>pe(o.col,o.id))),A.lastSyncAt=Date.now(),j(),n&&(tt(!0),ie())},()=>{A.signedIn=!1,j(),tt(!1)}),setTimeout(()=>tt(!1),8e3)}function Eo(){return[...be].map(([e,t])=>({key:e,local:F.get(e),server:t.server}))}function No(e){let t=be.get(e),n=K.get(e);!t||!n||(n.baseRev=t.server.rev,n.gen=!1,be.delete(e),fe([e]),j(),ie())}function Ao(e){let t=be.get(e);t&&(sn(e,t.server),fe([e]),j())}async function Oo(e,t){return await V("/api/setup",{method:"POST",body:{code:e,password:t}}),se.passwordSet=!0,Po()}async function Ro(e){return await V("/api/login",{method:"POST",body:{password:e}}),Po()}async function Po(){A.signedIn=!0,A.lastSeq=0,fe(),j(),await ie()}async function Lo(){try{await V("/api/logout",{method:"POST"})}catch{}A.signedIn=!1,fe(),j()}function U(){return{signedIn:A.signedIn,deviceOnly:ae,passwordSet:se.passwordSet,cloudChecked:se.cloudChecked,online:se.online,syncing:se.syncing,pending:K.size,conflicts:be.size,lastSyncAt:A.lastSyncAt,lastError:A.lastError}}function ln(){let e=[];for(let t of F.values())t.deleted||e.push({col:t.col,id:t.id,data:t.data});return{app:"my-day",version:1,exportedAt:new Date().toISOString(),records:e}}function cn(e){if(!e||e.app!=="my-day"||!Array.isArray(e.records))throw new Error("This file is not a My Day backup.");let t=new Set(["tasks","series","reminders","config","content","money","office"]);for(let o of e.records)if(!t.has(o.col)||typeof o.id!="string"||typeof o.data!="object"||!o.data)throw new Error("The backup file is damaged or incomplete.");let n={};for(let o of e.records)n[o.col]=(n[o.col]||0)+1;return n}async function Fo(e,t){cn(e);let n=new Map(e.records.map(a=>[pe(a.col,a.id),a])),o=0;for(let[a,s]of n){let r=F.get(a);if(t==="merge"&&r&&!r.deleted&&!r.gen&&(r.data?.updatedAt||0)>=(s.data.updatedAt||0)||r&&!r.deleted&&Io(r.data,s.data))continue;let l={...s.data};I(s.col,s.id,l,{force:t==="replace"}),F.get(a).data.updatedAt=s.data.updatedAt||Date.now(),o++}if(t==="replace")for(let[a,s]of[...F])!s.deleted&&!n.has(a)&&(ge(s.col,s.id,{force:!0}),o++);return fe([...n.keys()]),await At(),j(),ie(),o}var Ce="Asia/Kolkata",dn=new Map;function Hs(e){return dn.has(e)||dn.set(e,new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"})),dn.get(e)}function ke(e,t=Ce){let n={};for(let{type:a,value:s}of Hs(t).formatToParts(e))n[a]=s;let o=Number(n.hour)%24;return{date:`${n.year}-${n.month}-${n.day}`,hour:o,minute:Number(n.minute),second:Number(n.second),minutes:o*60+Number(n.minute)}}var Uo=(e=Ce,t=new Date)=>ke(t,e).date,Ot=(e=Ce,t=new Date)=>ke(t,e).minutes;function Oe(e){let[t,n,o]=e.split("-").map(Number);return Date.UTC(t,n-1,o)}function Ho(e){return new Date(e).toISOString().slice(0,10)}var D=(e,t)=>Ho(Oe(e)+t*864e5),J=e=>new Date(Oe(e)).getUTCDay(),we=(e,t)=>Math.round((Oe(t)-Oe(e))/864e5),me=e=>typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e)&&Ho(Oe(e))===e,Ie=e=>typeof e=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e);function ot(e){let t=J(e);return D(e,t===0?-6:1-t)}var Vo=e=>D(ot(e),6);function E(e){let[t,n]=e.split(":").map(Number);return t*60+n}function Bo(e,t=Ce){let n=ke(e,t),o=Oe(n.date)+(n.minutes*60+n.second)*1e3;return Math.round((o-Math.floor(e.getTime()/1e3)*1e3)/6e4)}function jo(e,t,n=Ce){let o=Oe(e)+E(t)*6e4,a=o-Bo(new Date(o),n)*6e4;return a=o-Bo(new Date(a),n)*6e4,new Date(a)}var qo=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Wo=["January","February","March","April","May","June","July","August","September","October","November","December"],Q=(e,t=!1)=>t?qo[e].slice(0,3):qo[e];function P(e){if(!e)return"";let[t,n]=e.split(":").map(Number),o=t<12?"AM":"PM";return`${t%12===0?12:t%12}:${String(n).padStart(2,"0")} ${o}`}function L(e,{long:t=!1,withYear:n=!1}={}){if(!e)return"";let[o,a,s]=e.split("-").map(Number),r=J(e),l=t?Wo[a-1]:Wo[a-1].slice(0,3);return`${Q(r,!t)}, ${s} ${l}${n?" "+o:""}`}function q(e,t){let n=we(t,e);return n===0?"Today":n===1?"Tomorrow":n===-1?"Yesterday":L(e,{withYear:Math.abs(n)>300})}var Yo=["Family","Sitz Ergo","Content","Personal","Finance","Complaints","Migration"],un=[0,1,2,3,4,5,6],re=[1,2,3,4,5],Rt=[6],Pt=[0],Vs=[1,2,3,4,5,6],zo=0,O=(e,t,n,o,a,s={})=>({id:`b${String(++zo).padStart(2,"0")}`,days:e,start:t,end:n,title:o,kind:a,...s});function js(){return zo=0,[O(un,"07:00","09:00","Personal routine, breakfast and family","routine"),O(Vs,"09:00","09:30","Office morning check","office",{link:"office"}),O(Pt,"09:00","09:30","Brief office update (only if needed)","office",{link:"office"}),O(un,"21:30",null,"Work shutdown","marker"),O(un,"23:00","07:00","Protected sleep window","sleep"),O(re,"09:30","11:30","Topic research and references","work"),O(re,"11:30","12:00","Break and calls","break"),O(re,"12:00","13:00","Reaction clip preparation","work"),O(re,"13:00","14:00","Lunch and rest","break"),O(re,"14:00","15:00","Clips, thumbnail and live outline","work"),O(re,"15:00","15:30","Editor coordination and output review","work"),O(re,"15:30","16:15","Daily administration theme","admin",{link:"admin"}),O(re,"16:15","16:35","Office closing check","office",{link:"office"}),O(re,"16:35","17:30","Buffer","buffer"),O(re,"17:30","19:15","Family, personal needs and dinner","family"),O(re,"19:15","20:00","Live preparation","live"),O(re,"20:00","21:15","Live session","live"),O(re,"21:15","21:30","Editor handoff and tomorrow\u2019s priorities","work"),O(Rt,"09:30","13:00","Flexible content preparation","work"),O(Rt,"13:00","14:00","Lunch and rest","break"),O(Rt,"14:00","17:30","Household errands","family"),O(Rt,"17:30","21:30","Family and personal time","family"),O(Pt,"09:30","18:00","Family and rest","family"),O(Pt,"18:00","18:20","Weekly review","review"),O(Pt,"18:20","21:30","Family and rest","family")]}function Ys(){return{1:"Business jobs, clients and collections",2:"Bank, credit and legal follow-ups",3:"Household expenses and family needs",4:"Support cases and migration planning",5:"Weekly finances and next week\u2019s content"}}var at=()=>({blocks:js(),themes:Ys()});function pn(){return{sections:[{id:"brother",title:"Brother",minutes:10,items:["Jobs","Staff","Materials","Blockers"]},{id:"admin",title:"Admin",minutes:10,items:["Customers","Quotations","Billing","Collections"]},{id:"mine",title:"My decisions",minutes:10,items:["Decision","Owner","Next action"],decisions:!0}]}}var fn=()=>({tz:"Asia/Kolkata",quietStart:"22:30",quietEnd:"07:00"}),mn={office:"Time for your office check.",shutdown:"Time to start your work shutdown.",review:"Time for your weekly review.",task:"You have a reminder in My Day.",custom:"You have a reminder in My Day.",test:"Test notification from My Day. Notifications are working."};function Ko(){return[{id:"default-office",label:"Office check",textKey:"office",enabled:!0,schedule:{type:"daily",time:"09:00"}},{id:"default-shutdown",label:"Work shutdown",textKey:"shutdown",enabled:!0,schedule:{type:"daily",time:"21:30"}},{id:"default-review",label:"Weekly review",textKey:"review",enabled:!0,schedule:{type:"weekly",weekday:0,time:"18:00"}}]}var te=["Idea","Research","Clips","Thumbnail","Ready","Live/Recorded","Editor","Published"],Lt={recording:"Standalone recording",live:"Live session",liveEdit:"Edited from a live session"},Re={received:"Money received",spent:"Money spent",expected:"Expected income",receivable:"Someone owes me",payable:"I need to pay"};var Jo=(e,t)=>`${e}@${t}`;function hn(e){return e.freq==="daily"?[0,1,2,3,4,5,6]:e.freq==="weekdays"?[1,2,3,4,5]:e.days||[]}function Qo(e,t){return e.active===!1||e.startDate&&t<e.startDate||e.endDate&&t>e.endDate?!1:hn(e).includes(J(t))}var Go=["title","nextAction","category","owner","notes"];function zs(e,t){let n={id:Jo(e.id,t),seriesId:e.id,occurrenceDate:t,plannedDate:t,status:"open",detached:!1};for(let o of Go)e[o]!=null&&(n[o]=e[o]);return e.reminderTime&&(n.reminder={anchor:"planned",daysBefore:0,time:e.reminderTime}),n}function Xo(e,t,n,o){let a=[],s=we(n,o);for(let r=0;r<=s;r++){let l=D(n,r);if(!Qo(e,l))continue;let d=Jo(e.id,l);t.has(d)||a.push(zs(e,l))}return a}function Zo(e,t,n){let o=[],a=[];for(let s of t){if(s.seriesId!==e.id||s.detached||s.status!=="open"||s.occurrenceDate<n)continue;if(!Qo(e,s.occurrenceDate)){a.push(s.id);continue}let r={...s},l=!1;for(let u of Go)(e[u]??null)!==(s[u]??null)&&(e[u]==null?delete r[u]:r[u]=e[u],l=!0);let d=e.reminderTime?{anchor:"planned",daysBefore:0,time:e.reminderTime}:void 0;JSON.stringify(d)!==JSON.stringify(s.reminder)&&(d?r.reminder=d:delete r.reminder,l=!0),l&&o.push(r)}return{update:o,remove:a}}var Ft=["today","week","waiting","later","completed"],ea={today:"Today",week:"This Week",waiting:"Waiting",later:"Later",completed:"Completed"},$n=e=>e.status==="open",Ks=(e,t)=>e.seriesId&&e.plannedDate<t;function bn(e,t){return!$n(e)||Ks(e,t)?!1:e.plannedDate&&e.plannedDate<=t||e.dueDate===t||e.priorityDate===t}function ta(e,t){if(!$n(e)||bn(e,t))return!1;let n=Vo(t);return e.plannedDate&&e.plannedDate>t&&e.plannedDate<=n||e.dueDate&&e.dueDate>t&&e.dueDate<=n}function Js(e,t){return e.status==="later"?!0:!$n(e)||e.seriesId?!1:!bn(e,t)&&!ta(e,t)}function na(e,t){return e.status==="waiting"&&!!e.followUpDate&&e.followUpDate<=t}var yn=(e,t)=>(e.plannedDate||"9999").localeCompare(t.plannedDate||"9999")||(e.createdAt||0)-(t.createdAt||0);function st(e,t,n){let o=e.filter(a=>!a.deleted);switch(t){case"today":return o.filter(a=>bn(a,n)).sort(yn);case"week":return o.filter(a=>ta(a,n)).sort(yn);case"waiting":return o.filter(a=>a.status==="waiting").sort((a,s)=>(a.followUpDate||"9999").localeCompare(s.followUpDate||"9999"));case"later":return o.filter(a=>Js(a,n)).sort(yn);case"completed":return o.filter(a=>a.status==="done").sort((a,s)=>(s.completedAt||0)-(a.completedAt||0));default:return[]}}function oa(e,t){return e.filter(n=>!n.deleted&&n.priorityDate===t&&(n.status==="open"||n.status==="done")).sort((n,o)=>(n.priorityOrder??0)-(o.priorityOrder??0))}function aa(e,t,n=14){let o=D(t,n);return e.filter(a=>!a.deleted&&a.dueDate&&a.status!=="done"&&a.status!=="skipped"&&a.dueDate<=o).sort((a,s)=>a.dueDate.localeCompare(s.dueDate))}function Pe(e,t){let n=we(t,e);return n<0?"Deadline passed":n===0?"Due today":n===1?"Due tomorrow":`Due in ${n} days`}var sa=(e,t=Date.now())=>({...e,status:"done",completedAt:t}),ia=e=>({...e,status:"open",completedAt:null});function ra(e,{waitingFor:t,lastContact:n,followUpDate:o}){return{...e,status:"waiting",waitingFor:t||e.waitingFor||"",lastContact:n,followUpDate:o}}function la(e,t){let n={...e,plannedDate:t,status:e.status==="later"?"open":e.status};return e.priorityDate&&e.priorityDate!==t&&(n.priorityDate=null),e.seriesId&&(n.detached=!0),n}function W(){return crypto.randomUUID?crypto.randomUUID():[...crypto.getRandomValues(new Uint8Array(16))].map(t=>t.toString(16).padStart(2,"0")).join("")}var he=()=>({...fn(),...ve("config","settings")||{}}),X=()=>he().tz,k=()=>Uo(X()),Se=()=>ve("config","schedule")||at(),vn=()=>ve("config","office")||pn(),ca=e=>I("config","settings",e),it=e=>I("config","schedule",e),da=e=>I("config","office",e);function ua(){nt("config","schedule")||I("config","schedule",at(),{gen:!0}),nt("config","settings")||I("config","settings",fn(),{gen:!0}),nt("config","office")||I("config","office",pn(),{gen:!0});for(let e of Ko())nt("reminders",e.id)||I("reminders",e.id,e,{gen:!0})}function Le(){let e=k(),t=Mo("tasks");for(let n of Te("series"))for(let o of Xo(n,t,e,D(e,13)))o.createdAt=Date.now(),I("tasks",o.id,o,{gen:!0})}var Z=()=>Te("tasks"),Fe=e=>ve("tasks",e),G=e=>I("tasks",e.id,e),pa=e=>{e.seriesId?I("tasks",e.id,{...e,status:"skipped"}):ge("tasks",e.id)};function Be(e){let t={id:W(),status:"open",createdAt:Date.now(),...e};for(let n of Object.keys(t))(t[n]===""||t[n]===void 0)&&delete t[n];return G(t),t}var rt=e=>G(sa(e)),gn=e=>G(ia(e)),fa=(e,t)=>G(la(e,t)),ma=(e,t)=>G(ra(e,t)),Bt=e=>G({...e,status:"open",plannedDate:k()}),ha=e=>G({...e,status:"later",plannedDate:null,priorityDate:null});function lt(e,t){let n=k();return t?Z().filter(a=>a.priorityDate===n&&a.id!==e.id&&a.status==="open").length>=3?!1:(G({...e,priorityDate:n,priorityOrder:Date.now(),plannedDate:e.plannedDate&&e.plannedDate<=n?e.plannedDate:n,status:e.status==="later"?"open":e.status}),!0):G({...e,priorityDate:null})}var ya=()=>Te("series");function $a(e){let t=!ve("series",e.id),n={...e,id:e.id||W()};if(I("series",n.id,n),!t){let{update:o,remove:a}=Zo(n,Z().filter(s=>s.seriesId===n.id),k());o.forEach(G),a.forEach(s=>I("tasks",s,{...Fe(s),status:"skipped"}))}return Le(),n}function ba(e){let t=k();I("series",e.id,{...e,active:!1,endDate:D(t,-1)});for(let n of Z())n.seriesId===e.id&&n.status==="open"&&n.occurrenceDate>=t&&!n.detached&&I("tasks",n.id,{...n,status:"skipped"})}var Ve=()=>Te("reminders"),kn=()=>Te("content"),je=()=>Te("money");function ct(e,t){let n=t?.quietStart,o=t?.quietEnd;if(!n||!o||n===o)return!1;let a=E(e),s=E(n),r=E(o);return s>r?a>=s||a<r:a>=s&&a<r}function Qs(e,t,n){if(!ct(t,n))return{date:e,time:t,shifted:!1};let o=E(t),a=E(n.quietStart);return{date:a>E(n.quietEnd)&&o>=a?D(e,1):e,time:n.quietEnd,shifted:!0}}function Gs(e){let t=e.reminder;if(!t)return null;let n=Number(t.daysBefore)||0;return t.anchor==="due"?e.dueDate?D(e.dueDate,-n):null:t.anchor==="planned"?e.plannedDate?D(e.plannedDate,-n):null:t.anchor==="followup"?e.followUpDate||null:t.anchor==="fixed"&&t.date||null}var Xs=e=>!e.deleted&&e.reminder&&e.reminder.enabled!==!1&&(e.reminder.anchor==="followup"?e.status==="waiting":["open","waiting","later"].includes(e.status));function Zs(e,t){let n=e.schedule||{};return n.type==="daily"?n.time:n.type==="weekly"?J(t)===Number(n.weekday)?n.time:null:n.type==="once"&&n.date===t?n.time:null}function wn({reminders:e=[],tasks:t=[],settings:n={}},o,a){let s=n.tz||Ce,r=[],l=(c,p,h,f,m)=>{let $=Qs(p,h,n),g=jo($.date,$.time,s).getTime();g>o&&g<=a&&r.push({key:c,fireAt:g,textKey:f,ref:m,shifted:$.shifted})},d=D(ke(new Date(o),s).date,-1),u=we(d,D(ke(new Date(a),s).date,1));for(let c of e)if(!(c.deleted||c.enabled===!1))for(let p=0;p<=u;p++){let h=D(d,p),f=Zs(c,h);f&&l(`r:${c.id}:${h}T${f}`,h,f,c.textKey||"custom",c.id)}for(let c of t){if(!Xs(c))continue;let p=Gs(c),h=c.reminder.time||"09:00";p&&l(`t:${c.id}:${p}T${h}`,p,h,"task",c.id)}return r.sort((c,p)=>c.fireAt-p.fireAt)}function va(e,t=Date.now(),n=8){return wn(e,t,t+n*864e5)}var ga=e=>mn[e]||mn.custom;function C(){let[,e]=Ze(t=>t+1,0);z(()=>Do(e),[])}function _a(){let[e,t]=v(Date.now());return z(()=>{let n=setInterval(()=>t(Date.now()),3e4),o=()=>!document.hidden&&t(Date.now());return document.addEventListener("visibilitychange",o),()=>{clearInterval(n),document.removeEventListener("visibilitychange",o)}},[]),e}var ne=[],Sn=new Set,_n=()=>Sn.forEach(e=>e());function T(e,t,n={}){let o=Math.random().toString(36).slice(2);return ne=[...ne,{id:o,title:e,Comp:t,props:n,opener:document.activeElement}],_n(),o}function xa(e){let t=ne.find(n=>n.id===e)||ne[ne.length-1];ne=ne.filter(n=>n!==t),_n(),t?.props?.onDismiss?.(),t?.opener?.focus?.({preventScroll:!0})}function ei(){if(!ne.length)return;let e=ne;ne=[],_n(),e.forEach(t=>t.props?.onDismiss?.())}function Y(e,{ok:t="Yes",cancel:n="Cancel"}={}){return new Promise(o=>{let a=!1,s=r=>{a||(a=!0,o(r))};T("Please confirm",ti,{message:e,ok:t,cancel:n,answer:s,onDismiss:()=>s(!1)})})}function ti({message:e,ok:t,cancel:n,answer:o,close:a}){return i`<div class="stack">
    <p>${e}</p>
    <div class="sheet-actions">
      <button type="button" class="btn quiet" onClick=${()=>{o(!1),a()}}>${n}</button>
      <button type="button" class="btn" data-autofocus onClick=${()=>{o(!0),a()}}>${t}</button>
    </div>
  </div>`}addEventListener("hashchange",ei);function Da(){let[,e]=Ze(t=>t+1,0);return z(()=>(Sn.add(e),()=>Sn.delete(e)),[]),z(()=>{document.body.classList.toggle("sheet-open",ne.length>0);let t=n=>{n.key==="Escape"&&ne.length&&xa()};return document.addEventListener("keydown",t),()=>document.removeEventListener("keydown",t)}),ne.map((t,n)=>i`<${ni} key=${t.id} s=${t} top=${n===ne.length-1} />`)}function ni({s:e,top:t}){let n=fo();z(()=>{(n.current?.querySelector("[data-autofocus]")||n.current?.querySelector("h2"))?.focus({preventScroll:!0})},[]);let o=()=>xa(e.id);return i`
    <div class="sheet-backdrop" onClick=${o} aria-hidden="true"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label=${e.title} ref=${n} inert=${!t}>
      <div class="sheet-head">
        <h2 tabindex="-1">${e.title}</h2>
        <button class="icon-btn" onClick=${o} aria-label="Close">✕</button>
      </div>
      <div class="sheet-body"><${e.Comp} ...${e.props} close=${o} /></div>
    </div>`}var qe=null,dt=new Set;function w(e,t){qe={message:e,action:t,id:Date.now()},dt.forEach(o=>o());let n=qe.id;setTimeout(()=>{qe?.id===n&&(qe=null,dt.forEach(o=>o()))},5e3)}function Ta(){let[,e]=Ze(n=>n+1,0);if(z(()=>(dt.add(e),()=>dt.delete(e)),[]),!qe)return i`<div class="toast-region" aria-live="polite"></div>`;let t=qe;return i`<div class="toast-region" aria-live="polite">
    <div class="toast"><span>${t.message}</span>
      ${t.action&&i`<button class="link-btn" onClick=${()=>{t.action.run(),qe=null,dt.forEach(n=>n())}}>${t.action.label}</button>`}
    </div></div>`}function b({label:e,hint:t,children:n,id:o}){return i`<label class="field" for=${o}><span class="field-label">${e}</span>${n}${t&&i`<span class="hint">${t}</span>`}</label>`}function oe({options:e,value:t,onChange:n,label:o}){return i`<div class="segmented" role="tablist" aria-label=${o}>
    ${e.map(([a,s])=>i`<button type="button" role="tab" aria-selected=${a===t} class=${a===t?"on":""} onClick=${()=>n(a)}>${s}</button>`)}
  </div>`}function _e({options:e,value:t,onChange:n,allowNone:o=!0,label:a}){return i`<div class="chips" role="group" aria-label=${a}>
    ${e.map(([s,r])=>i`<button type="button" class=${"chip"+(s===t?" on":"")} aria-pressed=${s===t}
      onClick=${()=>n(o&&s===t?"":s)}>${r}</button>`)}
  </div>`}var Ye=()=>Yo.map(e=>[e,e]);function ce({children:e}){return i`<p class="empty">${e}</p>`}function M({title:e,action:t,children:n,cls:o=""}){return i`<section class=${"card "+o}>
    ${(e||t)&&i`<div class="card-head">${e&&i`<h2>${e}</h2>`}${t}</div>`}
    ${n}
  </section>`}function ka(e,t){let n=(t-J(e)+7)%7||7;return D(e,n)}function ut({value:e,onChange:t,includeNone:n=!0,label:o="Date",id:a}){let s=k(),r=[[s,"Today"],[D(s,1),"Tomorrow"],[ka(s,1),"Next Monday"]];return J(s)>=1&&J(s)<=5&&r.push([ka(s,6),"Saturday"]),i`<div class="date-quick">
    <div class="chips" role="group" aria-label=${o}>
      ${r.map(([l,d])=>i`<button type="button" class=${"chip"+(e===l?" on":"")} aria-pressed=${e===l} onClick=${()=>t(l)}>${d}</button>`)}
      ${n&&i`<button type="button" class=${"chip"+(e?"":" on")} aria-pressed=${!e} onClick=${()=>t("")}>No date</button>`}
    </div>
    <input id=${a} type="date" value=${e||""} onInput=${l=>t(l.currentTarget.value)} aria-label=${o} />
  </div>`}function Ma(e,t){let n=[];return e.category&&n.push(e.category),e.status==="waiting"?(n.push(`Waiting for ${e.waitingFor||"someone"}`),e.followUpDate&&n.push(e.followUpDate<=t?"Follow up today":`Follow up ${q(e.followUpDate,t)}`)):e.plannedDate&&e.plannedDate!==t&&n.push(e.plannedDate<t?`Planned ${q(e.plannedDate,t)}`:`Planned ${q(e.plannedDate,t)}`),e.dueDate&&n.push(`${Pe(e.dueDate,t)} (${L(e.dueDate)})`),e.seriesId&&n.push("Routine"),e.owner&&n.push(`Owner: ${e.owner}`),n}var wa=["Done. Nicely handled.","One less thing. Well done.","Lovely, that\u2019s done.","Done. Keep the calm going.","Ticked off. Good work."],Sa=["var(--accent)","var(--attn)","var(--sky-1)","var(--sky-2)"];function oi(e){if(!e?.getBoundingClientRect||matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=e.getBoundingClientRect(),n=document.createElement("div");n.className="burst",n.setAttribute("aria-hidden","true"),n.style.left=`${t.left+t.width/2}px`,n.style.top=`${t.top+t.height/2}px`;for(let o=0;o<10;o++){let a=document.createElement("i"),s=o/10*Math.PI*2+Math.random()*.4,r=26+Math.random()*20;a.style.setProperty("--x",`${Math.cos(s)*r}px`),a.style.setProperty("--y",`${Math.sin(s)*r}px`),a.style.background=Sa[o%Sa.length],n.appendChild(a)}document.body.appendChild(n),setTimeout(()=>n.remove(),800)}function We({task:e,today:t,actions:n=!1}){let o=e.status==="done",a=s=>{if(o){gn(e);return}oi(s?.currentTarget),rt(e),w(wa[Math.floor(Math.random()*wa.length)],{label:"Undo",run:()=>G(e)})};return i`<li class=${"task"+(o?" done":"")}>
    <div class="task-main">
      <button class="check" onClick=${a} aria-label=${o?`Mark \u201C${e.title}\u201D as not done`:`Mark \u201C${e.title}\u201D as done`} aria-pressed=${o}>
        <span aria-hidden="true">${o?"\u2713":""}</span>
      </button>
      <button class="task-text" onClick=${()=>ai(e)}>
        <span class="task-title">${e.title}</span>
        ${e.nextAction&&i`<span class="task-next">Next: ${e.nextAction}</span>`}
        <span class="task-meta">${Ma(e,t).join(" \xB7 ")}</span>
      </button>
    </div>
    ${n&&!o&&i`<div class="task-actions">
      <button class="btn small" onClick=${a}>Done</button>
      <button class="btn small secondary" onClick=${()=>T("Reschedule",Ca,{task:e})}>Reschedule</button>
      <button class="btn small secondary" onClick=${()=>T("Waiting for someone",Ia,{task:e})}>Waiting</button>
    </div>`}
  </li>`}function qt({items:e,today:t,actions:n,empty:o}){return e.length?i`<ul class="task-list">${e.map(a=>i`<${We} key=${a.id} task=${a} today=${t} actions=${n} />`)}</ul>`:i`<${ce}>${o}<//>`}function ai(e){T(e.title,si,{id:e.id})}function si({id:e,close:t}){C();let n=Fe(e);if(!n)return i`<p>This item was removed.</p>`;let o=k(),a=n.priorityDate===o,s=(r,l)=>()=>{r(),t(),l&&w(l)};return i`<div class="stack">
    <p class="muted">${Ma(n,o).join(" \xB7 ")||"No details yet"}</p>
    ${n.nextAction&&i`<p><strong>Next action:</strong> ${n.nextAction}</p>`}
    ${n.notes&&i`<p class="notes">${n.notes}</p>`}
    <div class="action-grid">
      ${n.status!=="done"&&i`<button class="btn" onClick=${s(()=>rt(n),"Marked as done")}>Done</button>`}
      ${n.status==="done"&&i`<button class="btn" onClick=${s(()=>gn(n),"Moved back to open")}>Not done yet</button>`}
      <button class="btn secondary" onClick=${()=>{t(),T("Reschedule",Ca,{task:n})}}>Reschedule</button>
      ${n.status==="waiting"?i`<button class="btn secondary" onClick=${s(()=>Bt(n),"Back on today\u2019s list")}>No longer waiting</button>`:i`<button class="btn secondary" onClick=${()=>{t(),T("Waiting for someone",Ia,{task:n})}}>Waiting</button>`}
      ${n.status==="open"&&i`<button class="btn secondary" onClick=${()=>{let r=lt(n,!a);t(),w(r===!1?"You already have three priorities today.":a?"Removed from priorities":"Added to today\u2019s priorities")}}>${a?"Remove from priorities":"Make a priority"}</button>`}
      ${n.status!=="later"&&n.status!=="done"&&!n.seriesId&&i`<button class="btn secondary" onClick=${s(()=>ha(n),"Moved to Later")}>Later</button>`}
      <button class="btn secondary" onClick=${()=>{t(),T("Edit",Ue,{task:n})}}>Edit</button>
    </div>
  </div>`}function Ca({task:e,close:t}){let[n,o]=v(e.plannedDate&&e.plannedDate>k()?e.plannedDate:D(k(),1)),a=()=>{me(n)&&(fa(Fe(e.id)||e,n),t(),w(`Moved to ${q(n,k())}`))};return i`<div class="stack">
    ${e.seriesId&&i`<p class="note">This moves only this day of the routine. Other days stay as they are.</p>`}
    ${e.dueDate&&i`<p class="note">The real deadline stays ${L(e.dueDate)}. Only the planned date changes.</p>`}
    <${b} label="New planned date" id="resched-date"><${ut} id="resched-date" value=${n} onChange=${o} includeNone=${!1} label="New planned date" /><//>
    <div class="sheet-actions"><button class="btn" onClick=${a} disabled=${!me(n)}>Move</button></div>
  </div>`}function Ia({task:e,close:t}){let n=k(),[o,a]=v(e.waitingFor||e.owner||""),[s,r]=v(e.lastContact||n),[l,d]=v(e.followUpDate&&e.followUpDate>n?e.followUpDate:D(n,3)),u=()=>{ma(Fe(e.id)||e,{waitingFor:o.trim(),lastContact:s,followUpDate:l}),t(),w(`Waiting. It will come back on ${q(l,n)}.`)};return i`<form class="stack" onSubmit=${c=>{c.preventDefault(),u()}}>
    <${b} label="Who am I waiting for?" id="w-who"><input id="w-who" data-autofocus value=${o} onInput=${c=>a(c.currentTarget.value)} autocomplete="off" /><//>
    <${b} label="Last contact" id="w-last"><input id="w-last" type="date" value=${s} onInput=${c=>r(c.currentTarget.value)} /><//>
    <${b} label="Follow up on" id="w-follow" hint="Until then, this stays quietly in the Waiting list."><${ut} id="w-follow" value=${l} onChange=${d} includeNone=${!1} label="Follow-up date" /><//>
    <div class="sheet-actions"><button class="btn" type="submit" disabled=${!me(l)}>Save</button></div>
  </form>`}function Ea({close:e}){let t=k(),[n,o]=v(""),[a,s]=v("today"),[r,l]=v("");return i`<form class="stack" onSubmit=${u=>{if(u.preventDefault(),!n.trim())return;let c=a==="today"?t:a==="tomorrow"?D(t,1):"";Be({title:n.trim(),category:r,plannedDate:c,status:a==="later"?"later":"open"}),e(),w("Captured")}}>
    <${b} label="What’s on your mind?" id="qc-title">
      <input id="qc-title" data-autofocus value=${n} onInput=${u=>o(u.currentTarget.value)} autocomplete="off" enterkeyhint="done" placeholder="e.g. Call the bank about the statement" />
    <//>
    <${oe} label="When" value=${a} onChange=${s} options=${[["today","Today"],["tomorrow","Tomorrow"],["later","Later"]]} />
    <${_e} label="Category" options=${Ye()} value=${r} onChange=${l} />
    <div class="sheet-actions"><button class="btn" type="submit" disabled=${!n.trim()}>Save</button></div>
  </form>`}var ii=[["","No reminder"],["planned","On the planned date"],["due","Before the deadline"],["fixed","On a specific date"]];function Ue({task:e,close:t,defaults:n={}}){let o=!e,[a,s]=v(()=>e?{...e}:{title:"",status:"open",plannedDate:k(),...n}),r=m=>$=>s(g=>({...g,[m]:$})),l=m=>$=>r(m)($.currentTarget.value),d=a.reminder||null,u=m=>s($=>({...$,reminder:m===null?null:{anchor:"planned",daysBefore:0,time:"09:00",...$.reminder||{},...m}})),c=he(),p=m=>{if(m.preventDefault(),!a.title.trim())return;let $={...a,title:a.title.trim()};$.reminder&&!$.reminder.anchor&&($.reminder=null),o?Be($):G($),t(),w(o?"Task added":"Saved")},h=async()=>{await Y(a.seriesId?"Skip this day of the routine?":"Delete this task? This cannot be undone.",{ok:a.seriesId?"Skip this day":"Delete"})&&(pa(e),t(),w(a.seriesId?"Skipped for this day":"Deleted"))},f=d?.time&&ct(d.time,c);return i`<form class="stack" onSubmit=${p}>
    ${a.seriesId&&i`<p class="note">Changes here apply to this day only. To change every day, edit the routine in More → Routines.</p>`}
    <${b} label="Title" id="te-title"><input id="te-title" data-autofocus=${o} value=${a.title} onInput=${l("title")} required autocomplete="off" /><//>
    <${b} label="Next action" id="te-next" hint="The very next physical step."><input id="te-next" value=${a.nextAction||""} onInput=${l("nextAction")} autocomplete="off" /><//>
    <div class="field"><span class="field-label">Category</span><${_e} label="Category" options=${Ye()} value=${a.category||""} onChange=${r("category")} /></div>
    <${b} label="Status" id="te-status">
      <select id="te-status" value=${a.status} onChange=${l("status")}>
        <option value="open">To do</option><option value="waiting">Waiting for someone</option><option value="later">Later</option><option value="done">Done</option>
      </select>
    <//>
    <${b} label="Planned date" id="te-planned" hint="When I intend to work on it. Not a deadline."><${ut} id="te-planned" value=${a.plannedDate||""} onChange=${r("plannedDate")} label="Planned date" /><//>
    <${b} label="Real deadline (optional)" id="te-due" hint="Only for confirmed deadlines."><input id="te-due" type="date" value=${a.dueDate||""} onInput=${l("dueDate")} /><//>
    <${b} label="Owner (optional)" id="te-owner" hint="Who is responsible. No message is sent."><input id="te-owner" value=${a.owner||""} onInput=${l("owner")} autocomplete="off" /><//>
    ${a.status==="waiting"&&i`
      <${b} label="Waiting for" id="te-wf"><input id="te-wf" value=${a.waitingFor||""} onInput=${l("waitingFor")} autocomplete="off" /><//>
      <${b} label="Last contact" id="te-lc"><input id="te-lc" type="date" value=${a.lastContact||""} onInput=${l("lastContact")} /><//>`}
    <${b} label="Follow-up date" id="te-fu"><input id="te-fu" type="date" value=${a.followUpDate||""} onInput=${l("followUpDate")} /><//>
    <${b} label="Notes" id="te-notes"><textarea id="te-notes" rows="3" value=${a.notes||""} onInput=${l("notes")}></textarea><//>
    <fieldset class="field">
      <legend class="field-label">Reminder</legend>
      <select aria-label="Reminder" value=${d?.anchor||""} onChange=${m=>u(m.currentTarget.value?{anchor:m.currentTarget.value}:null)}>
        ${ii.map(([m,$])=>i`<option value=${m}>${$}</option>`)}
        <option value="followup">On the follow-up date</option>
      </select>
      ${d&&i`<div class="row">
        ${d.anchor==="due"&&i`<label class="inline">Days before <select value=${String(d.daysBefore||0)} onChange=${m=>u({daysBefore:Number(m.currentTarget.value)})}>
          ${[0,1,2,3,7].map(m=>i`<option value=${String(m)}>${m===0?"Same day":m}</option>`)}</select></label>`}
        ${d.anchor==="fixed"&&i`<input type="date" aria-label="Reminder date" value=${d.date||""} onInput=${m=>u({date:m.currentTarget.value})} />`}
        <input type="time" aria-label="Reminder time" value=${d.time||"09:00"} onInput=${m=>u({time:m.currentTarget.value})} />
      </div>
      <span class="hint">${f?`This is inside quiet hours, so it will arrive at ${P(c.quietEnd)}.`:"The notification will only say \u201CYou have a reminder in My Day.\u201D"}</span>`}
    </fieldset>
    <div class="sheet-actions">
      ${!o&&i`<button type="button" class="btn quiet" onClick=${h}>${a.seriesId?"Skip this day":"Delete"}</button>`}
      <button class="btn" type="submit" disabled=${!a.title.trim()}>${o?"Add task":"Save"}</button>
    </div>
  </form>`}function ze(e){return e.deviceOnly?{text:"Saved on this device",tone:"ok"}:e.signedIn?e.conflicts?{text:`${e.conflicts} to review`,tone:"attn"}:e.online?e.syncing?{text:"Syncing\u2026",tone:"neutral"}:e.pending?{text:`${e.pending} not synced yet`,tone:"attn"}:e.lastError?{text:"Sync problem",tone:"attn"}:{text:"Saved",tone:"ok"}:{text:e.pending?`Offline \xB7 ${e.pending} not synced`:"Offline",tone:"neutral"}:{text:e.cloudChecked?"On this device only":"Connecting\u2026",tone:"neutral"}}function xe(){C();let e=U(),t=ze(e);return i`<a class=${"pill "+t.tone} href="#more/sync" aria-label=${"Sync status: "+t.text}>${t.text}</a>`}var xn=e=>e.end!=null&&E(e.end)<=E(e.start);function Ne(e,t){let n=J(t);return e.filter(o=>o.days.includes(n)).sort((o,a)=>E(o.start)-E(a.start)||(o.end==null)-(a.end==null))}function Wt(e,t){return e.themes?.[J(t)]||""}function Na(e,t=new Date,n=Ce){let{date:o,minutes:a}=ke(t,n),s=Ne(e,o),r=Ne(e,D(o,-1)),l=null;for(let u of r)xn(u)&&a<E(u.end)&&(l={...u,date:D(o,-1)});for(let u of s){if(u.end==null)continue;let c=E(u.start),p=E(u.end);(xn(u)?a>=c:a>=c&&a<p)&&(l={...u,date:o})}let d=s.find(u=>E(u.start)>a);if(d)d={...d,date:o};else for(let u=1;u<=7&&!d;u++){let c=D(o,u),p=Ne(e,c)[0];p&&(d={...p,date:c})}return{current:l,next:d,date:o,minutes:a}}function Aa(e,t){if(!e?.end)return null;let n=E(e.end);return n>t?n-t:n+1440-t}function Oa(e,t){let n=Ne(e,t).filter(a=>a.end&&!xn(a)),o=[];for(let a=0;a<n.length;a++)for(let s=a+1;s<n.length;s++){let r=n[a],l=n[s];E(l.start)<E(r.end)&&E(r.start)<E(l.end)&&o.push([r,l])}return o}var Ut=[["Act as if what you do makes a difference. It does.","William James"],["What you do today can improve all your tomorrows.","Ralph Marston"],["Start where you are. Use what you have. Do what you can.","Arthur Ashe"],["Well done is better than well said.","Benjamin Franklin"],["No act of kindness, no matter how small, is ever wasted.","Aesop"],["The journey of a thousand miles begins with one step.","Lao Tzu"],["We are what we repeatedly do. Excellence, then, is not an act, but a habit.","Will Durant"],["Courage doesn\u2019t always roar. Sometimes courage is the quiet voice at the end of the day saying, \u201CI will try again tomorrow.\u201D","Mary Anne Radmacher"],["If you can\u2019t fly then run, if you can\u2019t run then walk, if you can\u2019t walk then crawl, but whatever you do you have to keep moving forward.","Martin Luther King Jr."],["Inaction breeds doubt and fear. Action breeds confidence and courage.","Dale Carnegie"],["Our greatest glory is not in never falling, but in rising every time we fall.","Oliver Goldsmith"],["Small deeds done are better than great deeds planned.","Peter Marshall"],["Be kind whenever possible. It is always possible.","Dalai Lama"],["Gratitude turns what we have into enough.","Unknown"],["One day at a time.","Proverb"],["A calm mind brings inner strength and self-confidence.","Dalai Lama"],["Focus on being productive instead of busy.","Tim Ferriss"],["Family is not an important thing. It\u2019s everything.","Michael J. Fox"],["Energy and persistence conquer all things.","Benjamin Franklin"],["The best time to plant a tree was 20 years ago. The second best time is now.","Proverb"],["Make each day your masterpiece.","John Wooden"],["Do the best you can until you know better. Then when you know better, do better.","Maya Angelou"],["Whoever is happy will make others happy too.","Anne Frank"],["Life is 10% what happens to you and 90% how you react to it.","Charles R. Swindoll"],["Perseverance is not a long race; it is many short races one after the other.","Walter Elliot"],["You miss 100% of the shots you don\u2019t take.","Wayne Gretzky"],["Little by little, one travels far.","Proverb"],["Rest is not idleness.","John Lubbock"],["Do what you can, with what you have, where you are.","Theodore Roosevelt"],["Happiness is not something ready made. It comes from your own actions.","Dalai Lama"]];function Ht(e){let t=Math.floor(Date.parse(e+"T00:00:00Z")/864e5),[n,o]=Ut[(t%Ut.length+Ut.length)%Ut.length];return{q:n,a:o,source:"built-in"}}var ft=[["food","Food & groceries","\u{1F6D2}"],["eating","Eating out","\u{1F37D}\uFE0F"],["transport","Fuel & transport","\u26FD"],["bills","Bills & utilities","\u{1F4A1}"],["household","Household","\u{1F3E0}"],["shopping","Shopping","\u{1F6CD}\uFE0F"],["health","Health","\u{1F48A}"],["education","Education & fees","\u{1F393}"],["family","Family & gifts","\u{1F381}"],["fun","Fun & outings","\u{1F3AC}"],["emi","EMI & loans","\u{1F3E6}"],["rent","Rent","\u{1F511}"],["insurance","Insurance","\u{1F6E1}\uFE0F"],["subs","Subscriptions & renewals","\u{1F501}"],["card","Credit card","\u{1F4B3}"],["tax","Tax","\u{1F9FE}"],["work","Work & content","\u{1F3A5}"],["staff","Staff & wages","\u{1F465}"],["other","Other","\u{1F4CC}"]],Dn=Object.fromEntries(ft.map(([e,t,n],o)=>[e,{id:e,label:t,icon:n,hue:Math.round(o*137.5%360)}])),ue=e=>Dn[e]||Dn.other,Vt=[["Groceries","food"],["Vegetables & fruits","food"],["Milk","food"],["Meat & fish","food"],["Restaurant / hotel","eating"],["Tea & snacks","eating"],["Swiggy / Zomato","eating"],["Petrol / diesel","transport"],["Auto / taxi","transport"],["Bus / train","transport"],["Parking & toll","transport"],["Vehicle service","transport"],["Electricity bill","bills"],["Water bill","bills"],["Mobile recharge","bills"],["Internet / broadband","bills"],["Gas cylinder","bills"],["House rent","rent"],["Home repairs","household"],["Cleaning & household items","household"],["Maid / helper","household"],["Clothes","shopping"],["Online shopping","shopping"],["Electronics","shopping"],["Medicines","health"],["Doctor / hospital","health"],["School fees","education"],["Tuition","education"],["Books & stationery","education"],["Gifts","family"],["Family support","family"],["Function / wedding","family"],["Movies & outings","fun"],["Travel / trip","fun"],["EMI","emi"],["Loan repayment","emi"],["Insurance premium","insurance"],["OTT / app subscription","subs"],["Software & renewals","subs"],["Credit card bill","card"],["Income tax / GST","tax"],["Editor payment","work"],["Equipment & gear","work"],["Salary / wages","staff"]],Ra=e=>Vt.find(([t])=>t===e)?.[1],Tn=[["cash","Cash"],["bank","Bank / UPI"],["card","Credit card"]],Pa=["Federal Bank","Axis Bank","Canara Bank","State Bank of India","South Indian Bank"];function Mn(e){return e.via==="cash"?"Cash":e.via==="bank"?e.bank||"Bank":e.via==="card"?e.bank?`${e.bank} card`:"Credit card":""}var La=["emi","rent","insurance","subs","education","bills","card","tax","other"],pt=[["monthly","Every month",1,"Monthly"],["quarterly","Every 3 months",3,"Quarterly"],["halfyearly","Every 6 months",6,"Half-yearly"],["yearly","Every year",12,"Yearly"],["once","Only once",0,"One-time"]],Fa=Object.fromEntries(pt.map(([e,,t])=>[e,t])),Ba=(e,t=!1)=>(pt.find(n=>n[0]===e)||pt[0])[t?3:1],qa=(e,t)=>new Date(Date.UTC(e,t,0)).getUTCDate();function Wa(e,t,n){let[o,a,s]=e.split("-").map(Number),r=o*12+(a-1)+t,l=Math.floor(r/12),d=r%12+1,u=Math.min(n||s,qa(l,d));return`${l}-${String(d).padStart(2,"0")}-${String(u).padStart(2,"0")}`}function Ua(e){let t=Fa[e.repeat]??1;if(!t)return{...e,done:!0};let n=Wa(e.nextDue,t,e.dueDay||Number(e.nextDue.slice(8)));return e.endDate&&n>e.endDate?{...e,nextDue:n,done:!0}:{...e,nextDue:n}}function Ha(e){let t=Fa[e.repeat]??1;return t?(Number(e.amount)||0)/t:0}function mt(e,t,n=30,o){let a=D(t,n);return e.filter(s=>s.type==="bill"&&!s.done&&s.nextDue&&s.nextDue<=a&&(!o||s.book===o)).sort((s,r)=>s.nextDue.localeCompare(r.nextDue)||(Number(r.amount)||0)-(Number(s.amount)||0))}function ht(e,t){let n=we(t,e);return n===0?"Due today":n===1?"Due tomorrow":n>1?`Due in ${n} days`:n===-1?"1 day late":`${-n} days late`}var Ae=e=>e.slice(0,7);function yt(e,t){return Wa(`${e}-01`,t).slice(0,7)}function $t(e,t,n){let o=e.filter($=>$.book===t&&$.date&&Ae($.date)===n),a=$=>Number($.amount)||0,s=o.filter($=>$.type==="spent"),r=s.reduce(($,g)=>$+a(g),0),l=o.filter($=>$.type==="received").reduce(($,g)=>$+a(g),0),d=new Map;for(let $ of s){let g=Dn[$.category]?$.category:"other";d.set(g,(d.get(g)||0)+a($))}let u=[...d].map(([$,g])=>({...ue($),total:g,share:r?g/r:0})).sort(($,g)=>g.total-$.total),c=new Map;for(let $ of s){let g=Mn($)||"Not noted";c.set(g,(c.get(g)||0)+a($))}let p=[...c].map(([$,g])=>({label:$,total:g})).sort(($,g)=>g.total-$.total),[h,f]=n.split("-").map(Number),m=Array.from({length:qa(h,f)},()=>0);for(let $ of s)m[Number($.date.slice(8))-1]+=a($);return{spent:r,received:l,categories:u,methods:p,byDay:m,count:s.length}}var ye=e=>i`<svg viewBox="0 0 24 24" aria-hidden="true">${e}</svg>`,ri={office:ye(i`<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>`),content:ye(i`<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>`),money:ye(i`<rect x="2.8" y="6" width="18.4" height="13" rx="3"/><path d="M2.8 10h18.4M16 14.5h2.2"/>`),routines:ye(i`<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>`),schedule:ye(i`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`),themes:ye(i`<path d="M4 6.5h16M4 12h10M4 17.5h13"/><circle cx="19" cy="12" r="1.6"/>`),notifications:ye(i`<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>`),install:ye(i`<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3"/>`),settings:ye(i`<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>`),sync:ye(i`<path d="M7 18.5h10a4.5 4.5 0 0 0 .6-9A6 6 0 0 0 6 9.8a4.4 4.4 0 0 0 1 8.7z"/>`),data:ye(i`<rect x="3.5" y="4" width="17" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>`)},li=[["Plan",[["office","Office check","Daily 30 minutes",205],["content","Content","Ideas to published",335],["money","Money","Spending & payments",150],["routines","Routines","Repeating tasks",265]]],["Set up",[["schedule","Schedule","Time blocks",25],["themes","Admin themes","One per weekday",45],["notifications","Reminders","Office, shutdown, review",5],["install","Home Screen",N?"Open like an app":"Install on iPhone",185],["settings","Settings","Time zone, quiet hours",230]]],["Your data",[["sync",ae?"Saved where":N?"Cloud copy":"Sign-in & sync",null,215],["data","Backup","Export or restore",290]]]];function Va(){C();let e=ze(U());return i`<div class="screen">
    <header class="top"><h1>More</h1><${xe} /></header>
    ${li.map(([t,n])=>i`<section class="menu-group" aria-label=${t}>
      <h2 class="eyebrow">${t}</h2>
      <ul class="tile-grid">${n.map(([o,a,s,r])=>i`<li><a class="tile" href=${o==="money"?"#money":`#more/${o}`} style=${`--h:${r}`}>
        <span class="tile-icon">${ri[o]}</span>
        <span class="menu-title">${a}</span><span class="menu-desc">${s||e.text}</span>
      </a></li>`)}</ul>
    </section>`)}
    <p class="hint center">My Day · version 0.2${N?" \xB7 web app":ae?" \xB7 device edition":ee?" \xB7 live sync":""} · Private, single-user</p>
  </div>`}function B({title:e,back:t="#more"}){return i`<header class="top sub">
    <a class="back" href=${t} aria-label="Back">‹ Back</a>
    <h1>${e}</h1>
  </header>`}var ci=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}),di=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}),Ke=e=>ci.format(Number(e)||0),$e=e=>di.format(Math.round(Number(e)||0)),bt=new Set(["expected","receivable","payable"]),In=new Set(["spent","payable"]),Cn=new Set(["spent","received"]),Je=e=>Math.max(0,(Number(e.amount)||0)-(Number(e.paidAmount)||0)),On=["January","February","March","April","May","June","July","August","September","October","November","December"],Qe=e=>`${On[Number(e.slice(5))-1]} ${e.slice(0,4)}`,ui=e=>`${Number(e.slice(8))} ${On[Number(e.slice(5,7))-1].slice(0,3)}`,jt=e=>e.replace(/[^\d.]/g,"");function ja({id:e,value:t,onChange:n,ids:o}){let a=o?ft.filter(([s])=>o.includes(s)):ft;return i`<select id=${e} value=${t||""} onChange=${s=>n(s.currentTarget.value)}>
    ${!t&&i`<option value="" disabled>Choose a category</option>`}
    ${a.map(([s,r,l])=>i`<option value=${s}>${l}  ${r}</option>`)}
  </select>`}var Ya="myday-lastpay";function En(){try{return JSON.parse(localStorage.getItem(Ya))||{}}catch{return{}}}function za(e,t){try{localStorage.setItem(Ya,JSON.stringify({via:e,bank:t}))}catch{}}function Ka({via:e,bank:t,onChange:n,incoming:o=!1}){return i`<fieldset class="field"><legend class="field-label">${o?"Received in":"Paid via"}</legend>
    <${oe} label=${o?"Received in":"Paid via"} value=${e||""} onChange=${a=>n(a,a==="cash"?"":t)}
      options=${o?Tn.filter(([a])=>a!=="card"):Tn} />
    ${(e==="bank"||e==="card")&&i`<select aria-label=${e==="card"?"Card from which bank":"Which bank"} value=${t||""} onChange=${a=>n(e,a.currentTarget.value)}>
      <option value="">${e==="card"?"Which bank\u2019s card?":"Which bank?"}</option>
      ${Pa.map(a=>i`<option value=${a}>${a}</option>`)}
    </select>`}
  </fieldset>`}function pi({value:e,onPick:t}){let n=Vt.some(([s])=>s===e),[o,a]=v(!!e&&!n);return i`<${b} label="Item" id="me-item">
    <select id="me-item" value=${o?"__other":e||""} onChange=${s=>{let r=s.currentTarget.value;r==="__other"?(a(!0),t(n?"":e,null)):(a(!1),t(r,Ra(r)))}}>
      <option value="">Choose an item (optional)</option>
      ${ft.map(([s,r,l])=>{let d=Vt.filter(([,u])=>u===s);return d.length?i`<optgroup label=${`${l} ${r}`}>${d.map(([u])=>i`<option value=${u}>${u}</option>`)}</optgroup>`:null})}
      <option value="__other">Other (type a name)</option>
    </select>
    ${o&&i`<input aria-label="Item name" placeholder="What was it?" value=${e||""} onInput=${s=>t(s.currentTarget.value,null)} />`}
  <//>`}function Nn({entry:e,book:t,close:n,type:o}){let a=!e,[s,r]=v(()=>{if(e)return{...e};let f=o||"spent",m=En();return{id:W(),book:t,type:f,amount:"",date:k(),status:"pending",...Cn.has(f)&&m.via?{via:f==="received"&&m.via==="card"?"bank":m.via,bank:m.bank||""}:{}}}),l=(f,m)=>r($=>({...$,[f]:m})),d=Number(s.amount),u=d>0&&me(s.date)&&(!s.dueDate||me(s.dueDate)),c=f=>{if(f.preventDefault(),!u)return;let m={...s,amount:Math.round(d*100)/100};bt.has(m.type)||(delete m.status,delete m.dueDate,delete m.paidAmount),In.has(m.type)||delete m.category,Cn.has(m.type)?m.via&&za(m.via,m.bank):(delete m.via,delete m.bank),I("money",m.id,m),n(),w("Saved")},p=async()=>{await Y("Delete this entry?",{ok:"Delete"})&&(ge("money",s.id),n())},h=s.type==="spent";return i`<form class="stack" onSubmit=${c}>
    <${oe} label="Book" value=${s.book} onChange=${f=>l("book",f)} options=${[["personal","Personal"],["business","Business"]]} />
    <${b} label="Type" id="me-type"><select id="me-type" value=${s.type} onChange=${f=>l("type",f.currentTarget.value)}>${Object.entries(Re).map(([f,m])=>i`<option value=${f}>${m}</option>`)}</select><//>
    ${h&&i`<${pi} value=${s.title} onPick=${(f,m)=>r($=>({...$,title:f,...m?{category:m}:{}}))} />`}
    ${In.has(s.type)&&i`<${b} label="Category" id="me-cat"><${ja} id="me-cat" value=${s.category} onChange=${f=>l("category",f)} /><//>`}
    <${b} label="Amount (₹)" id="me-amt"><input id="me-amt" type="text" inputmode="decimal" data-autofocus=${a} value=${s.amount} onInput=${f=>l("amount",jt(f.currentTarget.value))} /><//>
    ${Cn.has(s.type)&&i`<${Ka} via=${s.via} bank=${s.bank} incoming=${s.type==="received"} onChange=${(f,m)=>r($=>({...$,via:f,bank:m}))} />`}
    <${b} label=${s.type==="receivable"?"Who owes me":s.type==="payable"?"Who I need to pay":h?"Paid to (optional)":"From / to (optional)"} id="me-party"><input id="me-party" value=${s.party||""} onInput=${f=>l("party",f.currentTarget.value)} /><//>
    ${!h&&i`<${b} label="What for (optional)" id="me-title"><input id="me-title" value=${s.title||""} onInput=${f=>l("title",f.currentTarget.value)} /><//>`}
    <${b} label="Date" id="me-date"><input id="me-date" type="date" value=${s.date} onInput=${f=>l("date",f.currentTarget.value)} /><//>
    ${bt.has(s.type)&&i`
      <${b} label=${s.type==="expected"?"Expected by (optional)":"Due date (optional)"} id="me-due"><input id="me-due" type="date" value=${s.dueDate||""} onInput=${f=>l("dueDate",f.currentTarget.value)} /><//>
      <${b} label="Status" id="me-status"><select id="me-status" value=${s.status} onChange=${f=>l("status",f.currentTarget.value)}>
        <option value="pending">Not paid yet</option><option value="partial">Partly paid</option><option value="paid">${s.type==="payable"?"Paid":"Received"}</option></select><//>
      ${s.status==="partial"&&i`<${b} label="Amount paid so far (₹)" id="me-paid"><input id="me-paid" inputmode="decimal" value=${s.paidAmount||""} onInput=${f=>l("paidAmount",jt(f.currentTarget.value))} /><//>`}`}
    <${b} label="Notes" id="me-notes"><textarea id="me-notes" rows="2" value=${s.notes||""} onInput=${f=>l("notes",f.currentTarget.value)}></textarea><//>
    <div class="sheet-actions">
      ${!a&&i`<button type="button" class="btn quiet" onClick=${p}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!u}>Save</button>
    </div>
  </form>`}function fi({entry:e,close:t}){let[n,o]=v(!0),a=e.type!=="payable",s=()=>{if(I("money",e.id,{...e,status:"paid",paidAmount:e.amount,settledOn:k()}),n){let r=W();I("money",r,{id:r,book:e.book,type:a?"received":"spent",amount:Je(e)||e.amount,party:e.party,title:e.title,date:k(),settles:e.id,...a?{}:{category:e.category}})}t(),w(a?"Marked as received":"Marked as paid")};return i`<div class="stack">
    <p>${Ke(Je(e))} ${a?"from":"to"} ${e.party||"this entry"}.</p>
    <label class="check-row"><input type="checkbox" checked=${n} onChange=${r=>o(r.currentTarget.checked)} /> Also add it to “${a?"Money received":"Money spent"}” today</label>
    <div class="sheet-actions"><button class="btn" onClick=${s}>${a?"Mark as received":"Mark as paid"}</button></div>
  </div>`}function An({bill:e,book:t,close:n}){let o=!e,[a,s]=v(()=>e?{...e}:{id:W(),type:"bill",book:t,kind:"emi",title:"",amount:"",repeat:"monthly",nextDue:D(k(),7),endDate:""}),r=(p,h)=>s(f=>({...f,[p]:h})),l=Number(a.amount),d=a.title.trim()&&l>0&&me(a.nextDue)&&(!a.endDate||me(a.endDate)),u=p=>{if(p.preventDefault(),!d)return;let h={...a,title:a.title.trim(),amount:Math.round(l*100)/100,dueDay:Number(a.nextDue.slice(8)),done:!1};h.endDate||delete h.endDate,I("money",h.id,h),n(),w(o?"Payment added":"Saved")},c=async()=>{await Y("Delete this regular payment? Payments already recorded stay.",{ok:"Delete"})&&(ge("money",a.id),n())};return i`<form class="stack" onSubmit=${u}>
    <${b} label="Name" id="bl-title"><input id="bl-title" data-autofocus=${o} placeholder="e.g. Car loan EMI, Netflix, School fees" value=${a.title} onInput=${p=>r("title",p.currentTarget.value)} /><//>
    <${b} label="Kind" id="bl-kind"><${ja} id="bl-kind" ids=${La} value=${a.kind} onChange=${p=>r("kind",p)} /><//>
    <${b} label="Amount (₹)" hint="If it changes each time, put the usual amount. You can change it when you pay." id="bl-amt"><input id="bl-amt" inputmode="decimal" value=${a.amount} onInput=${p=>r("amount",jt(p.currentTarget.value))} /><//>
    <${b} label="Repeats" id="bl-rep"><select id="bl-rep" value=${a.repeat} onChange=${p=>r("repeat",p.currentTarget.value)}>${pt.map(([p,h])=>i`<option value=${p}>${h}</option>`)}</select><//>
    <${b} label="Next due date" id="bl-due"><input id="bl-due" type="date" value=${a.nextDue} onInput=${p=>r("nextDue",p.currentTarget.value)} /><//>
    ${a.repeat!=="once"&&i`<${b} label="Last payment on (optional)" hint="For an EMI or a plan that ends." id="bl-end"><input id="bl-end" type="date" value=${a.endDate||""} onInput=${p=>r("endDate",p.currentTarget.value)} /><//>`}
    <${oe} label="Book" value=${a.book} onChange=${p=>r("book",p)} options=${[["personal","Personal"],["business","Business"]]} />
    <${b} label="Notes" id="bl-notes"><textarea id="bl-notes" rows="2" placeholder="Account, policy number, how to pay…" value=${a.notes||""} onInput=${p=>r("notes",p.currentTarget.value)}></textarea><//>
    <div class="sheet-actions">
      ${!o&&i`<button type="button" class="btn quiet" onClick=${c}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!d}>Save</button>
    </div>
  </form>`}function mi({bill:e,close:t}){let[n,o]=v(String(e.amount)),[a,s]=v(!0),[r,l]=v(()=>({via:e.via||En().via||"",bank:e.bank||En().bank||""})),d=Number(n),u=Ua(e),c=()=>{if(a){let p=W();I("money",p,{id:p,book:e.book,type:"spent",category:e.kind,amount:Math.round(d*100)/100,title:e.title,date:k(),billId:e.id,forDue:e.nextDue,...r.via?r:{}})}r.via&&za(r.via,r.bank),I("money",e.id,{...u,lastPaid:k(),...r.via?r:{}}),t(),w(u.done?`${e.title}: all paid`:`Paid. Next due ${L(u.nextDue)}`)};return i`<div class="stack">
    <p><strong>${e.title}</strong> · due ${L(e.nextDue)}</p>
    <${b} label="Amount paid (₹)" id="pb-amt"><input id="pb-amt" inputmode="decimal" value=${n} onInput=${p=>o(jt(p.currentTarget.value))} /><//>
    <${Ka} via=${r.via} bank=${r.bank} onChange=${(p,h)=>l({via:p,bank:h})} />
    <label class="check-row"><input type="checkbox" checked=${a} onChange=${p=>s(p.currentTarget.checked)} /> Add it to “Money spent” today</label>
    <p class="hint">${u.done?"This was the last payment.":`After this, the next one is due ${L(u.nextDue,{withYear:!0})}.`}</p>
    <div class="sheet-actions"><button class="btn" disabled=${a&&!(d>0)} onClick=${c}>Mark as paid</button></div>
  </div>`}function hi({b:e,today:t}){let n=ue(e.kind),o=e.nextDue<t,a=!o&&e.nextDue<=D(t,3);return i`<li class="bill">
    <button class="bill-main" onClick=${()=>T("Edit regular payment",An,{bill:e})}>
      <span class="cat-icon" style=${`--h:${n.hue}`} aria-hidden="true">${n.icon}</span>
      <span class="bill-text">
        <span class="task-title">${e.title}</span>
        <span class=${"task-meta"+(o?" late":a?" soon":"")}>${e.done?"Finished":`${ht(e.nextDue,t)} \xB7 ${ui(e.nextDue)}`} · ${Ba(e.repeat,!0)}</span>
      </span>
      <span class="amt">${$e(e.amount)}</span>
    </button>
    ${!e.done&&i`<button class="btn small secondary" onClick=${()=>T("Mark as paid",mi,{bill:e})} aria-label=${`Mark ${e.title} as paid`}>Paid</button>`}
  </li>`}function yi({entries:e,book:t,today:n}){let[o,a]=v(!1),s=e.filter(p=>p.type==="bill"&&p.book===t),r=s.filter(p=>!p.done),l=mt(s,n,30),d=o?[...r].sort((p,h)=>p.nextDue.localeCompare(h.nextDue)).concat(s.filter(p=>p.done)):l,u=l.reduce((p,h)=>p+(Number(h.amount)||0),0),c=r.reduce((p,h)=>p+Ha(h),0);return i`<${M} title="Upcoming payments" cls="payments" action=${i`<button class="link-btn" onClick=${()=>T("New regular payment",An,{book:t})}>+ Add</button>`}>
    ${r.length?i`<p class="hint">${l.length?`${$e(u)} due in the next 30 days`:"Nothing due in the next 30 days"} · about ${$e(c)} a month in regular payments</p>`:i`<p class="hint">Add EMIs, rent, insurance, renewals and fees once. They come back here before each due date, and on Today.</p>`}
    ${d.length>0&&i`<ul class="bill-list">${d.map(p=>i`<${hi} key=${p.id} b=${p} today=${n} />`)}</ul>`}
    ${s.length>l.length&&i`<button class="link-btn more" onClick=${()=>a(!o)}>${o?"Show only the next 30 days":`All regular payments (${s.length})`}</button>`}
    ${!r.length&&i`<button class="btn secondary" onClick=${()=>T("New regular payment",An,{book:t})}>+ Add a regular payment</button>`}
  <//>`}function $i({byDay:e,month:t,today:n}){let[o,a]=v(null),s=Math.max(...e,1),r=e.length,l=300,d=90,u=2,c=(l-u*(r-1))/r,p=Ae(n)===t?Number(n.slice(8))-1:-1,h=o??(p>=0?p:null),f=m=>`${t}-${String(m+1).padStart(2,"0")}`;return i`<div class="day-chart">
    <p class="chart-readout">${h!=null?i`<strong>${$e(e[h])}</strong> on ${L(f(h))}`:"Tap a day to see what you spent"}</p>
    <svg viewBox=${`0 0 ${l} ${d+14}`} role="img" aria-label=${`Spending per day in ${Qe(t)}`} preserveAspectRatio="none">
      <line x1="0" x2=${l} y1=${d+.5} y2=${d+.5} class="axis" />
      ${e.map((m,$)=>{let g=m?Math.max(3,m/s*(d-4)):0,y=$*(c+u);return i`<g key=${$} onClick=${()=>a($)} class=${"d"+($===h?" sel":"")+($===p?" today":"")}>
          <rect class="hit" x=${y} y="0" width=${c+u} height=${d+14} />
          ${g>0&&i`<rect class="bar" x=${y} y=${d-g} width=${c} height=${g} rx="1.5" />`}
          <title>${L(f($))}: ${$e(m)}</title>
        </g>`})}
      ${[0,9,19,r-1].map(m=>i`<text key=${"t"+m} x=${m*(c+u)+c/2} y=${d+12} text-anchor="middle" class="tick">${m+1}</text>`)}
    </svg>
  </div>`}function bi({entries:e,book:t,month:n,setMonth:o,today:a,cat:s,setCat:r}){let l=$t(e,t,n),d=$t(e,t,yt(n,-1)),u=n===Ae(a),c=u?Number(a.slice(8)):l.byDay.length,p=d.spent?(l.spent-d.spent)/d.spent:null,h=l.categories[0]?.total||1;return i`
    <div class="month-nav">
      <button class="icon-btn" aria-label="Previous month" onClick=${()=>o(yt(n,-1))}>‹</button>
      <span class="month-label">${Qe(n)}</span>
      <button class="icon-btn" aria-label="Next month" disabled=${u} onClick=${()=>o(yt(n,1))}>›</button>
    </div>
    <section class="card hero-stat" aria-label="Month totals">
      <p class="eyebrow">Spent${u?" this month":""}</p>
      <p class="hero-num">${$e(l.spent)}</p>
      <p class="hint">${p==null?`${l.count} expense${l.count===1?"":"s"}`:i`<span class=${p>0?"up":"down"}>${p>0?"\u25B2":"\u25BC"} ${Math.abs(Math.round(p*100))}%</span> vs ${On[Number(yt(n,-1).slice(5))-1]}${u?" (full month)":""}`}</p>
      <dl class="mini-stats">
        <div><dt>Received</dt><dd>${$e(l.received)}</dd></div>
        <div><dt>Daily average</dt><dd>${$e(l.spent/Math.max(1,c))}</dd></div>
        <div><dt>Left over</dt><dd class=${l.received-l.spent<0?"neg":""}>${$e(l.received-l.spent)}</dd></div>
      </dl>
    </section>
    <${M} title="Where it went">
      ${l.categories.length?i`<ul class="cat-bars">${l.categories.map(f=>i`<li key=${f.id}>
        <button class=${"cat-bar"+(s===f.id?" on":"")} aria-pressed=${s===f.id} onClick=${()=>r(s===f.id?"":f.id)}>
          <span class="cat-name"><span class="cat-dot" style=${`--h:${f.hue}`} aria-hidden="true">${f.icon}</span> ${f.label}</span>
          <span class="cat-amt">${$e(f.total)} <span class="muted">· ${Math.round(f.share*100)}%</span></span>
          <span class="track" aria-hidden="true"><span style=${`width:${Math.max(2,f.total/h*100)}%`}></span></span>
        </button>
      </li>`)}</ul><p class="hint">Tap a category to see its entries below.</p>`:i`<${ce}>No spending recorded for ${Qe(n)} yet.<//>`}
    <//>
    ${l.count>0&&i`<${M} title="Day by day"><${$i} byDay=${l.byDay} month=${n} today=${a} /><//>`}
    ${l.count>0&&i`<${M} title="How you paid">
      <ul class="pay-list">${l.methods.map(f=>i`<li key=${f.label}><span>${f.label}</span><span class="cat-amt">${$e(f.total)} <span class="muted">· ${Math.round(f.total/l.spent*100)}%</span></span></li>`)}</ul>
    <//>`}`}var vi=Object.entries(Re),Ja=(e="personal")=>T("New expense",Nn,{book:e,type:"spent"});function Rn({asTab:e=!1}){C();let t=k(),[n,o]=v("personal"),[a,s]=v(""),[r,l]=v(Ae(t)),[d,u]=v(""),c=je(),p=c.filter(y=>y.book===n&&y.type!=="bill"),h=(y,S=R=>Number(R.amount)||0)=>y.reduce((R,_)=>R+S(_),0),f=y=>p.filter(S=>S.type===y&&S.status!=="paid"),m=y=>bt.has(y.type)&&y.status!=="paid",$=p.filter(y=>y.date&&Ae(y.date)===r||m(y)&&!d).filter(y=>!a||y.type===a).filter(y=>!d||y.type==="spent"&&ue(y.category).id===d).sort((y,S)=>(m(y)?0:1)-(m(S)?0:1)||(S.date||"").localeCompare(y.date||"")).slice(0,300),g=y=>T(y==="spent"?"New expense":y==="received"?"Money received":"New entry",Nn,{book:n,type:y});return i`<div class="screen money">
    ${e?i`<header class="top"><div><p class="eyebrow">Spending and payments</p><h1 class="hero">Money</h1></div><${xe} /></header>`:i`<${B} title="Money" />`}
    <${oe} label="Book" value=${n} onChange=${y=>{o(y),u("")}} options=${[["personal","Personal"],["business","Business"]]} />
    <div class="quick-add">
      <button class="btn" onClick=${()=>g("spent")}>+ Expense</button>
      <button class="btn secondary" onClick=${()=>g("received")}>+ Income</button>
      <button class="btn secondary" aria-label="+ New entry" onClick=${()=>g(a&&a!=="spent"&&a!=="received"?a:"payable")}>+ Other</button>
    </div>
    <${bi} entries=${c.filter(y=>y.type!=="bill")} book=${n} month=${r} setMonth=${y=>{l(y),u("")}} today=${t} cat=${d} setCat=${u} />
    <${yi} entries=${c} book=${n} today=${t} />
    <${M} title="Owed and expected">
      <dl class="sums">
        <div><dt>Others owe me</dt><dd>${Ke(h(f("receivable"),Je))}</dd></div>
        <div><dt>I need to pay</dt><dd>${Ke(h(f("payable"),Je))}</dd></div>
        <div class="wide"><dt>Expected income (not received yet)</dt><dd>${Ke(h(f("expected"),Je))}</dd></div>
      </dl>
    <//>
    <div class="card-head list-head">
      <h2>${d?`${ue(d).icon} ${ue(d).label} \xB7 ${Qe(r)}`:`Entries \xB7 ${Qe(r)}`}</h2>
      ${d&&i`<button class="link-btn" onClick=${()=>u("")}>Show all</button>`}
    </div>
    ${!d&&i`<${_e} label="Type" options=${vi} value=${a} onChange=${s} />`}
    ${$.length?i`<ul class="money-list">${$.map(y=>i`<li key=${y.id} class="money-row">
      <button class="money-main" onClick=${()=>T("Edit entry",Nn,{entry:y,book:n})}>
        <span class="m-top"><span class="task-title">${In.has(y.type)&&i`<span aria-hidden="true">${ue(y.category).icon} </span>`}${y.party||y.title||(y.type==="spent"?ue(y.category).label:Re[y.type])}</span><span class=${"amt "+y.type}>${Ke(y.amount)}</span></span>
        <span class="task-meta">${[y.type==="spent"?ue(y.category).label:Re[y.type],y.title&&y.party?y.title:"",L(y.date),Mn(y),bt.has(y.type)&&(y.status==="paid"?y.type==="payable"?"Paid":"Received":y.status==="partial"?`Partly paid \xB7 ${Ke(Je(y))} left`:"Not paid yet"),bt.has(y.type)&&y.status!=="paid"&&y.dueDate&&`${Pe(y.dueDate,t)} (${q(y.dueDate,t)})`].filter(Boolean).join(" \xB7 ")}</span>
      </button>
      ${m(y)&&i`<button class="btn small secondary" onClick=${()=>T(y.type==="payable"?"Mark as paid":"Mark as received",fi,{entry:y})}>${y.type==="payable"?"Paid":"Received"}</button>`}
    </li>`)}</ul>`:i`<${ce}>No entries for ${Qe(r)}.<//>`}
  </div>`}var Qa="myday-quote",gi=N?"https://liyakkathalic.github.io/my-day/quote.json":"quote.json",Ga=e=>e&&typeof e.q=="string"&&e.q.trim()&&e.q.length<400&&typeof e.a=="string";function Pn(e){try{let t=JSON.parse(localStorage.getItem(Qa));if(t?.day===e&&Ga(t))return t}catch{}return null}async function Xa(e){let t=Pn(e);if(t)return t;try{let n=new AbortController,o=setTimeout(()=>n.abort(),5e3),a=await fetch(gi,{cache:"no-store",signal:n.signal});clearTimeout(o);let s=await a.json();if(!a.ok||!Ga(s))throw new Error("bad quote");let r={q:s.q.trim(),a:s.a.trim()||"Unknown",source:s.source||"web",day:e};if(s.date===e)try{localStorage.setItem(Qa,JSON.stringify(r))}catch{}return r}catch{return{...Ht(e),day:e}}}var Za=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});function ki({today:e}){let[t,n]=v(()=>Pn(e)||Ht(e));return z(()=>{let o=!0;return Xa(e).then(a=>o&&n(a)),()=>{o=!1}},[e]),i`<figure class="quote" aria-label="Today’s quote">
    <span class="quote-mark" aria-hidden="true">“</span>
    <blockquote>${t.q}</blockquote>
    <figcaption>— ${t.a}${t.source==="zenquotes"&&i` · <a href="https://zenquotes.io/" target="_blank" rel="noopener">ZenQuotes</a>`}</figcaption>
  </figure>`}function wi({today:e}){let t=je(),n=$t(t,"personal",Ae(e)),o=mt(t,e,30)[0];return i`<section class="card money-snap" aria-label="Money">
    <a class="snap-main" href="#money">
      <span class="snap-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="2.8" y="6" width="18.4" height="13" rx="3"/><path d="M2.8 10h18.4M16 14.5h2.2"/><path d="M6 6l8.5-3 1.4 3"/></svg></span>
      <span class="snap-text">
        <span class="eyebrow">Money · this month</span>
        <strong>${Za.format(Math.round(n.spent))} spent</strong>
        <span class="task-meta">${o?`${ue(o.kind).icon} ${o.title}: ${ht(o.nextDue,e).toLowerCase()}`:"No payments due in the next 30 days"}</span>
      </span>
    </a>
    <button class="btn small" onClick=${()=>Ja()}>+ Expense</button>
  </section>`}function Si(e){return e>=300&&e<720?"Good morning":e>=720&&e<1020?"Good afternoon":e>=1020&&e<1320?"Good evening":"Rest well"}function _i(e){if(e==null)return"";let t=Math.floor(e/60),n=e%60;return t?`${t} h${n?` ${n} min`:""}`:`${n} min`}function xi({now:e}){let t=Se(),{current:n,next:o,minutes:a}=Na(t.blocks,new Date(e),X()),s=c=>c?.link==="admin"?Wt(t,c.date):"",r=n?.kind==="sleep",l=Aa(n,a),d=n?.end?E(n.end)-E(n.start):0;d<=0&&(d+=1440);let u=n?.end&&l!=null?Math.min(100,Math.max(0,Math.round((1-l/d)*100))):null;return i`<section class=${"card now"+(r?" sleep":"")} aria-label="Current time block">
    <p class="eyebrow">Now · ${P(String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0"))}</p>
    ${n?i`
      <h2 class="now-title">${n.title}</h2>
      ${s(n)&&i`<p class="theme">Today’s theme: ${s(n)}</p>`}
      <p class="muted">${P(n.start)}–${P(n.end)} · ${_i(l)} left</p>
      ${u!=null&&i`<div class="progress" role="progressbar" aria-label="Time block progress" aria-valuenow=${u} aria-valuemin="0" aria-valuemax="100"><span style=${`width:${u}%`}></span></div>`}
      ${r&&i`<p class="calm">Rest. Everything else can wait until morning.</p>`}
      ${n.link==="office"&&i`<a class="btn secondary" href="#more/office">Open office checklist</a>`}
    `:i`<h2 class="now-title">Open time</h2><p class="muted">Nothing scheduled right now.</p>`}
    ${o&&i`<div class="next">
      <span class="eyebrow">Next</span>
      <span><strong>${P(o.start)}</strong>${o.date!==k()?` (${q(o.date,k())})`:""} · ${o.title}${s(o)?` \u2014 ${s(o)}`:""}</span>
    </div>`}
  </section>`}function Di({close:e}){C();let t=k(),[n,o]=v(""),a=Z().filter(l=>l.status==="open"&&l.priorityDate!==t&&(!l.plannedDate||l.plannedDate<=D(t,7))).sort((l,d)=>(l.plannedDate||"9").localeCompare(d.plannedDate||"9")),s=l=>{lt(l,!0),e(),w("Added to today\u2019s priorities")};return i`<div class="stack">
    <form class="row" onSubmit=${l=>{if(l.preventDefault(),!n.trim())return;let d=Be({title:n.trim(),plannedDate:t});lt(d,!0),e()}}>
      <input aria-label="New priority" data-autofocus placeholder="Type a new priority" value=${n} onInput=${l=>o(l.currentTarget.value)} />
      <button class="btn" type="submit" disabled=${!n.trim()}>Add</button>
    </form>
    ${a.length?i`<p class="muted">Or choose an existing task:</p>
      <ul class="pick-list">${a.slice(0,30).map(l=>i`<li><button onClick=${()=>s(l)}>
        <span>${l.title}</span><span class="task-meta">${[l.category,l.plannedDate&&q(l.plannedDate,t)].filter(Boolean).join(" \xB7 ")}</span></button></li>`)}</ul>`:i`<${ce}>No other open tasks for this week.<//>`}
  </div>`}function Ti({items:e,today:t}){if(!e.length)return null;let n=o=>T("Next follow-up",Mi,{task:o});return i`<${M} title="Follow up today">
    <ul class="task-list">${e.map(o=>i`<li class="task" key=${o.id}>
      <div class="task-main"><div class="task-text static">
        <span class="task-title">${o.title}</span>
        <span class="task-meta">Waiting for ${o.waitingFor||"someone"}${o.lastContact?` \xB7 last contact ${q(o.lastContact,t)}`:""}</span>
      </div></div>
      <div class="task-actions">
        <button class="btn small secondary" onClick=${()=>n(o)}>Still waiting</button>
        <button class="btn small secondary" onClick=${()=>{Bt(o),w("Back on today\u2019s list")}}>Ready to act</button>
        <button class="btn small secondary" onClick=${()=>{rt(o),w("Marked as done")}}>Done</button>
      </div>
    </li>`)}</ul>
  <//>`}function Mi({task:e,close:t}){let n=k(),[o,a]=v(D(n,3));return i`<div class="stack">
    <${b} label="Follow up again on" id="sn-d"><${ut} id="sn-d" value=${o} onChange=${a} includeNone=${!1} label="Follow-up date" /><//>
    <div class="sheet-actions"><button class="btn" onClick=${()=>{G({...e,lastContact:n,followUpDate:o}),t(),w(`Next follow-up ${q(o,n)}`)}}>Save</button></div>
  </div>`}function Ci({today:e}){let t=aa(Z(),e).map(s=>({kind:"task",id:s.id,title:s.title,date:s.dueDate,t:s})),n=je().filter(s=>(s.type==="payable"||s.type==="receivable")&&s.status!=="paid"&&s.dueDate&&s.dueDate<=D(e,14)).map(s=>({kind:"money",id:s.id,title:`${Re[s.type]}: ${s.party||s.title||""}`.trim(),date:s.dueDate})),o=mt(je(),e,14).map(s=>({kind:"money",id:s.id,title:`${ue(s.kind).icon} ${s.title} \xB7 ${Za.format(Number(s.amount)||0)}`,date:s.nextDue,label:ht(s.nextDue,e)})),a=[...t,...n,...o].sort((s,r)=>s.date.localeCompare(r.date));return i`<${M} title="Deadlines and payments due">
    ${a.length?i`<ul class="deadlines">${a.map(s=>i`<li key=${s.kind+s.id}>
      ${s.kind==="task"?i`<button class="dl" onClick=${()=>T("Edit",Ue,{task:s.t})}><span class="dl-title">${s.title}</span><span class=${"dl-when"+(s.date<e?" passed":"")}>${Pe(s.date,e)} · ${L(s.date)}</span></button>`:i`<a class="dl" href="#more/money"><span class="dl-title">${s.title}</span><span class=${"dl-when"+(s.date<e?" passed":"")}>${s.label||Pe(s.date,e)} · ${L(s.date)}</span></a>`}
    </li>`)}</ul>`:i`<${ce}>No deadlines or payments due in the next two weeks.<//>`}
  <//>`}function es(){C();let e=_a(),t=k(),n=Z(),o=oa(n,t),a=o.filter(c=>c.status==="open"),s=st(n,"today",t).filter(c=>c.priorityDate!==t),r=n.filter(c=>na(c,t)),[l,d]=v(!1),u=l?s:s.slice(0,6);return i`<div class="screen">
    <${ki} today=${t} />
    <header class="top">
      <div><p class="eyebrow">${Si(Ot(X(),new Date(e)))} · Today</p><h1 class="hero">${L(t,{long:!0})}</h1></div>
      <${xe} />
    </header>
    ${ee&&!U().signedIn&&i`<a class="card attn signin-nudge" href="#more/sync"><strong>${U().passwordSet?"Sign in to sync":"Set up your password"}</strong><span>Until then, changes stay on this device only.</span></a>`}
    <${xi} now=${e} />
    <${wi} today=${t} />
    <${M} title="Today’s three priorities">
      <ul class="task-list prio">
        ${o.map(c=>i`<${We} key=${c.id} task=${c} today=${t} actions=${!0} />`)}
        ${a.length<3&&i`<li><button class="slot" onClick=${()=>T("Choose a priority",Di)}>+ Choose ${o.length?"another":"a"} priority</button></li>`}
      </ul>
    <//>
    <${Ti} items=${r} today=${t} />
    <${Ci} today=${t} />
    <${M} title="Also today" action=${i`<a class="link-btn" href="#tasks/today">All tasks</a>`}>
      <${qt} items=${u} today=${t} empty="Nothing else planned for today." />
      ${s.length>6&&i`<button class="link-btn more" onClick=${()=>d(!l)}>${l?"Show fewer":`Show ${s.length-6} more`}</button>`}
    <//>
    <button class="fab" onClick=${()=>T("Quick capture",Ea)} aria-label="Quick capture">
      <span aria-hidden="true">＋</span> Capture
    </button>
  </div>`}var Ii={today:"Nothing planned for today. Use Capture or add a task.",week:"Nothing else planned for this week.",waiting:"You are not waiting on anyone.",later:"No \u201Csomeday\u201D items.",completed:"Completed tasks will appear here."};function ts({sub:e,cat:t,go:n}){C();let o=Ft.includes(e)?e:"today",a=k(),s=Z(),r=st(s,o,a);t&&(r=r.filter(u=>u.category===t)),o==="completed"&&(r=r.slice(0,100));let l=Object.fromEntries(Ft.map(u=>[u,st(s,u,a).length])),d=u=>n(`#tasks/${o}${u?"/"+encodeURIComponent(u):""}`);return i`<div class="screen">
    <header class="top"><h1>Tasks</h1><${xe} /></header>
    <nav class="tabs" aria-label="Task lists">
      ${Ft.map(u=>i`<a href=${`#tasks/${u}${t?"/"+encodeURIComponent(t):""}`} class=${u===o?"on":""} aria-current=${u===o?"page":void 0}>
        ${ea[u]}${u!=="completed"&&l[u]?i` <span class="count">${l[u]}</span>`:""}</a>`)}
    </nav>
    <${_e} label="Filter by category" options=${Ye()} value=${t||""} onChange=${d} />
    <div class="row between">
      <button class="btn" onClick=${()=>T("New task",Ue,{defaults:o==="later"?{status:"later",plannedDate:""}:o==="waiting"?{status:"waiting"}:{}})}>+ New task</button>
      <a class="link-btn" href="#more/routines">Routines</a>
    </div>
    ${o==="waiting"&&i`<p class="hint">Waiting items stay here quietly and only come back to Today on their follow-up date.</p>`}
    <${qt} items=${r} today=${a} empty=${t?`No ${t} items in this list.`:Ii[o]} />
  </div>`}function Ei({date:e,today:t,open:n,onToggle:o}){let a=Se(),s=Z(),r=s.filter(m=>m.plannedDate===e&&(m.status==="open"||m.status==="done")&&!(m.seriesId&&e<t&&m.status!=="done")),l=s.filter(m=>m.dueDate===e&&m.status!=="done"&&m.status!=="skipped"),d=s.filter(m=>m.status==="waiting"&&m.followUpDate===e),u=Wt(a,e),c=Ne(a.blocks,e),p=c.some(m=>m.kind==="live"),h=e===t,f=r.filter(m=>m.status==="open").length;return i`<section class=${"card day"+(h?" is-today":"")}>
    <button class="day-head" onClick=${o} aria-expanded=${n}>
      <span class="day-name">${h?"Today \xB7 ":""}${L(e)}</span>
      <span class="day-sum">${[f?`${f} planned`:"",l.length?`${l.length} deadline${l.length>1?"s":""}`:"",p?"Live session":""].filter(Boolean).join(" \xB7 ")||"Nothing planned"}</span>
    </button>
    ${u&&i`<p class="theme">Admin theme: ${u}</p>`}
    ${n&&i`<div class="day-body">
      ${l.length>0&&i`<p class="eyebrow">Deadlines</p><ul class="task-list">${l.map(m=>i`<${We} key=${m.id} task=${m} today=${t} />`)}</ul>`}
      ${d.length>0&&i`<p class="eyebrow">Follow-ups</p><ul class="task-list">${d.map(m=>i`<${We} key=${m.id} task=${m} today=${t} />`)}</ul>`}
      <p class="eyebrow">Planned</p>
      ${r.length?i`<ul class="task-list">${r.map(m=>i`<${We} key=${m.id} task=${m} today=${t} />`)}</ul>`:i`<p class="empty">Nothing planned.</p>`}
      <button class="link-btn" onClick=${()=>T("New task",Ue,{defaults:{plannedDate:e}})}>+ Plan something for this day</button>
      <details class="blocks">
        <summary>Schedule (${c.length} blocks)</summary>
        <ul>${c.map(m=>i`<li><span class="b-time">${P(m.start)}${m.end?`\u2013${P(m.end)}`:""}</span><span>${m.title}</span></li>`)}</ul>
        <a class="link-btn" href=${`#more/schedule/${J(e)}`}>Edit this day’s schedule</a>
      </details>
    </div>`}
  </section>`}function ns(){C();let e=k(),[t,n]=v(0),[o,a]=v(e),s=D(ot(e),t*7),r=Array.from({length:7},(l,d)=>D(s,d));return i`<div class="screen">
    <header class="top"><h1>Week</h1><${xe} /></header>
    <div class="row between week-nav">
      <button class="btn secondary small" onClick=${()=>n(t-1)} aria-label="Previous week">‹ Previous</button>
      <span class="week-label">${t===0?"This week":`${L(r[0])} \u2013 ${L(r[6])}`}</span>
      <button class="btn secondary small" onClick=${()=>n(t+1)} aria-label="Next week">Next ›</button>
    </div>
    ${t!==0&&i`<button class="link-btn" onClick=${()=>n(0)}>Back to this week</button>`}
    ${r.map(l=>i`<${Ei} key=${l} date=${l} today=${e} open=${o===l} onToggle=${()=>a(o===l?null:l)} />`)}
  </div>`}var vt=[1,2,3,4,5,6,0],Ni=[["routine","Personal routine"],["office","Office check"],["work","Content work"],["admin","Administration"],["break","Break"],["family","Family"],["live","Live"],["buffer","Buffer"],["review","Review"],["marker","Single moment"],["sleep","Sleep"]],Ai=e=>D(ot(k()),vt.indexOf(e)),as=e=>{let t=[...e].sort().join(",");return t==="0,1,2,3,4,5,6"?"Every day":t==="1,2,3,4,5"?"Monday\u2013Friday":t==="1,2,3,4,5,6"?"Monday\u2013Saturday":vt.filter(n=>e.includes(n)).map(n=>Q(n,!0)).join(", ")};function os({block:e,weekday:t,close:n}){let o=!e,[a,s]=v(()=>e?{...e,days:[...e.days]}:{id:W(),title:"",start:"10:00",end:"11:00",days:[t],kind:"work"}),[r,l]=v("all"),[d,u]=v(e?e.end==null:!1),c=!o&&e.days.length>1,p=(y,S)=>s(R=>({...R,[y]:S})),h=y=>p("days",a.days.includes(y)?a.days.filter(S=>S!==y):[...a.days,y]),f=a.title.trim()&&Ie(a.start)&&(d||Ie(a.end))&&(r==="one"||a.days.length),m=!d&&Ie(a.end)&&E(a.end)<=E(a.start),$=y=>{if(y.preventDefault(),!f)return;let S=Se(),R={...a,title:a.title.trim(),end:d?null:a.end,link:a.kind==="office"?"office":a.kind==="admin"?"admin":void 0},_;o?_=[...S.blocks,R]:c&&r==="one"?(_=S.blocks.map(H=>H.id===e.id?{...H,days:H.days.filter(Is=>Is!==t)}:H),_.push({...R,id:W(),days:[t]})):_=S.blocks.map(H=>H.id===e.id?R:H),it({...S,blocks:_.filter(H=>H.days.length)}),n(),w("Schedule saved")},g=async()=>{let y=c&&r==="one";if(!await Y(y?`Remove this block from ${Q(t)} only?`:"Delete this block from every day it appears on?",{ok:"Remove"}))return;let S=Se(),R=y?S.blocks.map(_=>_.id===e.id?{..._,days:_.days.filter(H=>H!==t)}:_):S.blocks.filter(_=>_.id!==e.id);it({...S,blocks:R}),n(),w("Block removed")};return i`<form class="stack" onSubmit=${$}>
    ${c&&i`<div class="field"><span class="field-label">Apply changes to</span>
      <${oe} label="Apply changes to" value=${r} onChange=${l}
        options=${[["all",as(e.days)],["one",`Only ${Q(t)}`]]} /></div>`}
    <${b} label="Title" id="be-title"><input id="be-title" value=${a.title} onInput=${y=>p("title",y.currentTarget.value)} data-autofocus=${o} /><//>
    <div class="row">
      <${b} label="Start" id="be-start"><input id="be-start" type="time" value=${a.start} onInput=${y=>p("start",y.currentTarget.value)} /><//>
      ${!d&&i`<${b} label="End" id="be-end"><input id="be-end" type="time" value=${a.end||""} onInput=${y=>p("end",y.currentTarget.value)} /><//>`}
    </div>
    <label class="check-row"><input type="checkbox" checked=${d} onChange=${y=>u(y.currentTarget.checked)} /> Single moment (no end time), like “Work shutdown”</label>
    ${m&&i`<p class="hint">This block runs past midnight into the next morning.</p>`}
    <${b} label="Type" id="be-kind"><select id="be-kind" value=${a.kind} onChange=${y=>p("kind",y.currentTarget.value)}>${Ni.map(([y,S])=>i`<option value=${y}>${S}</option>`)}</select><//>
    ${(!c||r==="all")&&i`<fieldset class="field"><legend class="field-label">Days</legend>
      <div class="chips">${vt.map(y=>i`<button type="button" class=${"chip"+(a.days.includes(y)?" on":"")} aria-pressed=${a.days.includes(y)} onClick=${()=>h(y)}>${Q(y,!0)}</button>`)}</div>
    </fieldset>`}
    <div class="sheet-actions">
      ${!o&&i`<button type="button" class="btn quiet" onClick=${g}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!f}>Save</button>
    </div>
  </form>`}function ss({sub:e}){C();let t=new Date(k()+"T12:00:00Z").getUTCDay(),n=e!==void 0&&e!==""&&!Number.isNaN(Number(e))?Number(e):t,o=Se(),a=Ai(n),s=Ne(o.blocks,a),r=Oa(o.blocks,a),l=async()=>{await Y("Replace your whole schedule and themes with the original defaults?",{ok:"Reset schedule"})&&(it(at()),w("Default schedule restored"))};return i`<div class="screen">
    <${B} title="Schedule" />
    <nav class="tabs days" aria-label="Day of week">
      ${vt.map(d=>i`<a href=${`#more/schedule/${d}`} class=${d===n?"on":""} aria-current=${d===n?"page":void 0}>${Q(d,!0)}</a>`)}
    </nav>
    <p class="hint">Times are in ${X()}. Tap a block to change it.</p>
    ${r.length>0&&i`<p class="note">Some blocks overlap on ${Q(n)}: ${r.map(([d,u])=>`\u201C${d.title}\u201D and \u201C${u.title}\u201D`).join("; ")}. The later one is shown as current.</p>`}
    <ul class="block-list">
      ${s.map(d=>i`<li key=${d.id}><button class=${"block-row kind-"+d.kind} onClick=${()=>T("Edit block",os,{block:d,weekday:n})}>
        <span class="b-time">${P(d.start)}${d.end?i`<br />${P(d.end)}`:""}</span>
        <span class="b-main"><span class="b-title">${d.title}</span><span class="b-days">${as(d.days)}${d.link==="admin"&&o.themes[n]?` \xB7 ${o.themes[n]}`:""}</span></span>
      </button></li>`)}
    </ul>
    <div class="row between">
      <button class="btn" onClick=${()=>T("New block",os,{weekday:n})}>+ Add block</button>
      <button class="btn quiet" onClick=${l}>Reset to defaults</button>
    </div>
  </div>`}function is(){C();let e=Se(),[t,n]=v({...e.themes});return i`<div class="screen">
    <${B} title="Administration themes" />
    <p class="hint">Shown during the daily administration block and in the Week view.</p>
    <form class="stack card" onSubmit=${a=>{a.preventDefault(),it({...Se(),themes:t}),w("Themes saved")}}>
      ${vt.map(a=>i`<${b} label=${Q(a)} id=${"th"+a}>
        <input id=${"th"+a} value=${t[a]||""} placeholder=${a===0||a===6?"No theme":""} onInput=${s=>n({...t,[a]:s.currentTarget.value})} />
      <//>`)}
      <div class="sheet-actions"><button class="btn" type="submit">Save themes</button></div>
    </form>
  </div>`}var ls=[1,2,3,4,5,6,0],Oi=e=>e.freq==="daily"?"Every day":e.freq==="weekdays"?"Monday\u2013Friday":ls.filter(t=>hn(e).includes(t)).map(t=>Q(t,!0)).join(", ");function rs({series:e,close:t}){let n=!e,[o,a]=v(()=>e?{...e}:{id:W(),title:"",freq:"daily",days:[],startDate:k(),active:!0}),s=(u,c)=>a(p=>({...p,[u]:c})),r=o.title.trim()&&(o.freq!=="weekly"||o.days?.length),l=u=>{u.preventDefault(),r&&($a({...o,title:o.title.trim()}),t(),w(n?"Routine added":"Routine updated"))},d=async()=>{await Y("Stop this routine? Days already done stay in your history.",{ok:"Stop routine"})&&(ba(e),t(),w("Routine stopped"))};return i`<form class="stack" onSubmit=${l}>
    ${!n&&i`<p class="note">Changes apply from today onward. Days you completed, or changed one at a time, are not touched.</p>`}
    <${b} label="Title" id="re-title"><input id="re-title" data-autofocus=${n} value=${o.title} onInput=${u=>s("title",u.currentTarget.value)} /><//>
    <${b} label="Next action (optional)" id="re-next"><input id="re-next" value=${o.nextAction||""} onInput=${u=>s("nextAction",u.currentTarget.value)} /><//>
    <div class="field"><span class="field-label">Category</span><${_e} label="Category" options=${Ye()} value=${o.category||""} onChange=${u=>s("category",u)} /></div>
    <div class="field"><span class="field-label">Repeats</span>
      <${oe} label="Repeats" value=${o.freq} onChange=${u=>s("freq",u)} options=${[["daily","Every day"],["weekdays","Mon\u2013Fri"],["weekly","Pick days"]]} /></div>
    ${o.freq==="weekly"&&i`<div class="chips" role="group" aria-label="Days">${ls.map(u=>i`<button type="button" class=${"chip"+(o.days?.includes(u)?" on":"")} aria-pressed=${!!o.days?.includes(u)}
      onClick=${()=>s("days",o.days?.includes(u)?o.days.filter(c=>c!==u):[...o.days||[],u])}>${Q(u,!0)}</button>`)}</div>`}
    <${b} label="Starts on" id="re-start"><input id="re-start" type="date" value=${o.startDate} onInput=${u=>s("startDate",u.currentTarget.value)} /><//>
    <${b} label="Reminder time (optional)" id="re-rem" hint="Each day gets its own reminder. Completing one day cancels only that day’s reminder.">
      <input id="re-rem" type="time" value=${o.reminderTime||""} onInput=${u=>s("reminderTime",u.currentTarget.value)} />
    <//>
    <div class="sheet-actions">
      ${!n&&o.active!==!1&&i`<button type="button" class="btn quiet" onClick=${d}>Stop routine</button>`}
      <button class="btn" type="submit" disabled=${!r}>Save</button>
    </div>
  </form>`}function cs(){C();let e=ya().sort((t,n)=>(n.active!==!1)-(t.active!==!1)||t.title.localeCompare(n.title));return i`<div class="screen">
    <${B} title="Routines" />
    <p class="hint">Each day of a routine is a separate task. Finishing today does not finish tomorrow, and moving one day does not move the others.</p>
    <button class="btn" onClick=${()=>T("New routine",rs)}>+ New routine</button>
    ${e.length?i`<ul class="menu">${e.map(t=>i`<li key=${t.id}><button onClick=${()=>T("Edit routine",rs,{series:t})}>
      <span class="menu-title">${t.title}${t.active===!1?" (stopped)":""}</span>
      <span class="menu-desc">${[Oi(t),t.category,t.reminderTime&&`Reminder ${P(t.reminderTime)}`,t.active===!1&&t.endDate&&`Ended ${L(t.endDate)}`].filter(Boolean).join(" \xB7 ")}</span>
      <span class="chev" aria-hidden="true">›</span></button></li>`)}</ul>`:i`<${ce}>No routines yet. Add things you do on a regular basis, like paying a monthly bill or checking stock.<//>`}
  </div>`}function gt(){return navigator.standalone===!0||matchMedia("(display-mode: standalone)").matches}function Ge(){return/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1}function Yt(){let e="Notification"in window;return{secure:window.isSecureContext,standalone:gt(),ios:Ge(),supported:"serviceWorker"in navigator&&"PushManager"in window&&e,permission:e?Notification.permission:"unsupported"}}function Ri(e){let t="=".repeat((4-e.length%4)%4),n=atob((e+t).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(n,o=>o.charCodeAt(0))}var ds=()=>Ge()?"iPhone":/Android/.test(navigator.userAgent)?"Android":"Browser";async function Ln(){return"serviceWorker"in navigator?(await navigator.serviceWorker.ready).pushManager?.getSubscription()??null:null}async function us(){let e=await Notification.requestPermission();if(e!=="granted")return e;let{publicKey:t}=await V("/api/push/key"),n=await navigator.serviceWorker.ready,o=Ri(t),a=await n.pushManager.getSubscription();if(a){let s=a.options?.applicationServerKey&&new Uint8Array(a.options.applicationServerKey);s&&s.join()!==o.join()&&(await a.unsubscribe(),a=null)}return a||(a=await n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:o})),await V("/api/push/subscribe",{method:"POST",body:{subscription:a.toJSON(),label:ds()}}),"granted"}async function ps(){let e=await Ln();if(e)try{await V("/api/push/unsubscribe",{method:"POST",body:{endpoint:e.endpoint}})}finally{await e.unsubscribe()}}async function fs(){let e=await Ln();return{...await V("/api/push/status",{method:"POST",body:{endpoint:e?.endpoint||""}}),hasLocalSubscription:!!e}}async function zt(){try{let e=await Ln();e&&Notification.permission==="granted"&&await V("/api/push/subscribe",{method:"POST",body:{subscription:e.toJSON(),label:ds()}})}catch{}}var Fn=(e=0)=>V("/api/push/test",{method:"POST",body:{delaySeconds:e}});function Pi(){C();let e=U(),[t,n]=v(Yt()),[o,a]=v(null),[s,r]=v(!1),[l,d]=v(""),u=async()=>{if(n(Yt()),!e.signedIn||!navigator.onLine||!Yt().supported)return a(null);try{a(await fs())}catch(f){a({error:f.message})}};z(()=>{u()},[e.signedIn,e.online]);let c=f=>async()=>{r(!0),d("");try{await f()}catch(m){d(m.message||"Something went wrong.")}r(!1),u()},p=c(async()=>{let f=await us();f==="denied"?d("Notifications were not allowed. You can change this in iPhone Settings \u2192 Notifications \u2192 My Day."):f==="granted"&&d("Notifications are on for this device.")}),h;if(!t.secure)h=i`<p class="note">Notifications need a secure (https) address. Open My Day from its https web address.</p>`;else if(t.ios&&!t.standalone)h=i`<p class="note">On iPhone, notifications only work in the Home Screen app. <a href="#more/install">Add My Day to your Home Screen</a>, open it from there, sign in, and come back to this page.</p>`;else if(!t.supported)h=i`<p class="note">This browser does not support web notifications. On iPhone you need iOS 16.4 or later, using the Home Screen app.</p>`;else if(!e.signedIn)h=i`<p class="note">Sign in first, so the server can send reminders while the app is closed. <a href="#more/sync">Sign in</a></p>`;else if(!e.online)h=i`<p class="note">You are offline. Notification settings need an internet connection.</p>`;else if(t.permission==="denied")h=i`<p class="note">Notifications are turned off for My Day. To turn them on: iPhone Settings → Notifications → My Day → Allow Notifications. Then return here.</p>`;else if(t.permission!=="granted"||!o?.thisDevice?.registered)h=i`<p>Notifications are <strong>off</strong> on this device.</p>
      <button class="btn" onClick=${p} disabled=${s}>Enable Notifications</button>`;else{let f=o.thisDevice;h=i`<p>Notifications are <strong>on</strong> for this device.${o.devices>1?` (${o.devices} devices in total)`:""}</p>
      ${f.lastError&&i`<p class="note">The last attempt to reach this device failed (${f.lastError}). Try turning notifications off and on again.</p>`}
      ${f.lastDelivered&&i`<p class="hint">Last handed to Apple’s push service: ${new Date(f.lastDelivered).toLocaleString("en-IN",{timeZone:X()})}</p>`}
      <div class="action-grid">
        <button class="btn" disabled=${s} onClick=${c(async()=>{let m=await Fn(0);d(m.devices?"Test sent. It should arrive in a few seconds.":"No device accepted the test. Try enabling again.")})}>Send test now</button>
        <button class="btn secondary" disabled=${s} onClick=${c(async()=>{await Fn(120),d("A test will be sent in about 2 minutes. Close the app now (swipe it away) to check it arrives while closed.")})}>Test in 2 minutes (with app closed)</button>
        <button class="btn quiet" disabled=${s} onClick=${c(async()=>{await ps(),d("Notifications turned off for this device.")})}>Turn off on this device</button>
      </div>`}return i`<${M} title="Notifications on this device">
    ${h}
    ${l&&i`<p class="status-msg" role="status">${l}</p>`}
    <p class="hint">Status: permission ${t.permission==="default"?"not asked yet":t.permission}${t.standalone?" \xB7 Home Screen app":" \xB7 browser"}.</p>
    <p class="hint">Push notifications are best effort. Your phone and Apple decide when they are shown; Focus, Low Power Mode, no signal, or a server problem can delay or hide them. Do not rely on them as an alarm.</p>
  <//>`}function ms({reminder:e,close:t}){let n=!e,[o,a]=v(()=>e?JSON.parse(JSON.stringify(e)):{id:W(),label:"",textKey:"custom",enabled:!0,schedule:{type:"once",date:k(),time:"10:00"}}),s=c=>a(p=>({...p,schedule:{...p.schedule,...c}})),r=o.schedule,l=o.label.trim()&&Ie(r.time)&&(r.type!=="once"||me(r.date)),d=c=>{c.preventDefault(),l&&(I("reminders",o.id,{...o,label:o.label.trim()}),t(),w("Reminder saved"))},u=async()=>{await Y("Delete this reminder?",{ok:"Delete"})&&(ge("reminders",o.id),t())};return i`<form class="stack" onSubmit=${d}>
    <${b} label="What is it for? (only shown inside the app)" id="rm-label"><input id="rm-label" data-autofocus=${n} value=${o.label} onInput=${c=>a({...o,label:c.currentTarget.value})} /><//>
    ${o.textKey==="custom"&&i`<div class="field"><span class="field-label">Repeats</span><${oe} label="Repeats" value=${r.type} onChange=${c=>s({type:c,weekday:r.weekday??1,date:r.date||k()})}
      options=${[["once","Once"],["daily","Daily"],["weekly","Weekly"]]} /></div>`}
    ${r.type==="once"&&i`<${b} label="Date" id="rm-date"><input id="rm-date" type="date" value=${r.date} onInput=${c=>s({date:c.currentTarget.value})} /><//>`}
    ${r.type==="weekly"&&i`<${b} label="Day" id="rm-wd"><select id="rm-wd" value=${String(r.weekday)} onChange=${c=>s({weekday:Number(c.currentTarget.value)})}>
      ${[1,2,3,4,5,6,0].map(c=>i`<option value=${String(c)}>${Q(c)}</option>`)}</select><//>`}
    <${b} label="Time" id="rm-time" hint=${ct(r.time,he())?`Inside quiet hours \u2014 it will arrive at ${P(he().quietEnd)}.`:""}>
      <input id="rm-time" type="time" value=${r.time} onInput=${c=>s({time:c.currentTarget.value})} /><//>
    <p class="hint">The notification will only say “You have a reminder in My Day.”</p>
    <div class="sheet-actions">
      ${!n&&o.textKey==="custom"&&i`<button type="button" class="btn quiet" onClick=${u}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!l}>Save</button>
    </div>
  </form>`}function Li(){return i`<${M} title="Reminders in the web app">
    <p>While My Day is open, a reminder appears at the bottom of the screen when it is due.</p>
    ${ee?i`<p class="note">Phone notifications while the app is closed are not switched on in this version yet. Your reminder settings below carry over when they are.</p>`:i`<p class="note">This version cannot send phone notifications when it is closed${N?"":", because it has no server"}. For real iPhone reminders with the app closed, use the self-hosted version (it needs a small server — see the project’s DEPLOY guide). Your reminder settings below carry over.</p>`}
  <//>`}var Fi=e=>e.type==="daily"?`Every day at ${P(e.time)}`:e.type==="weekly"?`${Q(Number(e.weekday))}s at ${P(e.time)}`:`${q(e.date,k())} at ${P(e.time)}`;function hs(){C();let e=Ve().sort((a,s)=>(a.textKey==="custom")-(s.textKey==="custom")||a.label.localeCompare(s.label)),t=he(),n=va({reminders:Ve(),tasks:Z(),settings:t},Date.now(),7).slice(0,8),o=a=>a.key.startsWith("t:")?Fe(a.ref)?.title||"Task":Ve().find(s=>s.id===a.ref)?.label||"Reminder";return i`<div class="screen">
    <${B} title="Reminders" />
    ${De?i`<${Li} />`:i`<${Pi} />`}
    <${M} title="Reminders" action=${i`<button class="link-btn" onClick=${()=>T("New reminder",ms)}>+ Add</button>`}>
      <ul class="menu flat">${e.map(a=>i`<li key=${a.id}>
        <div class="toggle-row">
          <button class="toggle-text" onClick=${()=>T("Edit reminder",ms,{reminder:a})}>
            <span class="menu-title">${a.label}</span><span class="menu-desc">${Fi(a.schedule)}</span>
          </button>
          <label class="switch"><input type="checkbox" checked=${a.enabled!==!1} aria-label=${`${a.label} reminder on`}
            onChange=${s=>I("reminders",a.id,{...a,enabled:s.currentTarget.checked})} /><span></span></label>
        </div>
      </li>`)}</ul>
      <p class="hint">Deadline reminders are set on each task (open a task → Edit → Reminder). Quiet hours: ${P(t.quietStart)}–${P(t.quietEnd)} · <a href="#more/settings">change</a></p>
    <//>
    <${M} title="Coming up (next 7 days)">
      ${n.length?i`<ul class="plain">${n.map(a=>{let s=ke(new Date(a.fireAt),t.tz);return i`<li key=${a.key}><strong>${q(s.date,k())}, ${P(String(s.hour).padStart(2,"0")+":"+String(s.minute).padStart(2,"0"))}</strong> · ${o(a)}${a.shifted?" (moved out of quiet hours)":""}</li>`})}</ul>`:i`<${ce}>No reminders in the next 7 days.<//>`}
      ${!De&&i`<p class="hint">Reminders are sent by the server only for data that has synced. Unsynced changes on this device are not yet known to the server.</p>`}
    <//>
  </div>`}var Kt=e=>e?new Date(e).toLocaleString("en-IN",{timeZone:X(),dateStyle:"medium",timeStyle:"short"}):"never",Bn={tasks:"Tasks",series:"Routines",reminders:"Reminders",config:"Settings",content:"Content",money:"Money",office:"Office check notes"};function ys(e){if(!e||e.deleted||!e.data)return"Deleted";let t=e.data;return`${t.title||t.label||Bn[e.col]||e.id} \xB7 changed ${Kt(t.updatedAt)}`}function vs(){let e=Eo();return e.length?i`<${M} title="Changed on another device" cls="attn">
    <p>These items were changed both here and on another device. Choose which version to keep. Nothing is overwritten until you choose.</p>
    <ul class="plain">${e.map(t=>i`<li key=${t.key} class="conflict">
      <p><strong>${Bn[t.local?.col]||""}</strong></p>
      <p>This device: ${ys(t.local)}</p>
      <p>Other device: ${ys(t.server)}</p>
      <div class="row">
        <button class="btn small" onClick=${()=>No(t.key)}>Keep this device’s</button>
        <button class="btn small secondary" onClick=${()=>Ao(t.key)}>Keep the other one</button>
      </div>
    </li>`)}</ul>
  <//>`:null}function Bi(){C();let e=U(),t=ze(e);return i`<div class="screen">
    <${B} title="Cloud copy" />
    <${vs} />
    <${M} title="Status">
      <p><span class=${"pill "+t.tone}>${t.text}</span></p>
      ${e.signedIn?i`<p>Everything is saved to your claude.ai account, in a private area only you can read — even if you share this link. Open the same link on another device while signed in to see the same data.</p>`:e.cloudChecked?i`<p class="note">The cloud copy is not available right now (signed out, or no connection). Your changes are kept on this device and will be saved to the cloud when it is available again.</p>`:i`<p>Connecting to your account…</p>`}
      <ul class="plain">
        <li>Connection: ${e.online?"online":"offline"}</li>
        <li>Changes waiting to be saved to the cloud: ${e.pending}</li>
        <li>Last update from the cloud: ${Kt(e.lastSyncAt)}</li>
        ${e.lastError&&i`<li>Problem: ${e.lastError}</li>`}
      </ul>
      ${e.signedIn&&e.pending>0&&i`<div class="row"><button class="btn secondary" onClick=${()=>ie()} disabled=${e.syncing||!e.online}>Save now</button></div>`}
    <//>
  </div>`}var $s="https://claude.ai/artifact/MAqGTFf1E8dhmLBsBwZH9g";function qi(){return i`<div class="screen">
    <${B} title="Where my data is saved" />
    <${M} title="On this device">
      <p>This edition keeps everything in this browser on this device. Nothing is sent to any server, and it works offline once added to the Home Screen.</p>
      <p class="note">On iPhone, Safari and the Home Screen app keep separate storage. Pick one and use it every day.</p>
    <//>
    <${M} title="Keep a backup">
      <p>Browser storage can be cleared (for example by removing website data in Settings). Save a backup file every week and keep it in iCloud Drive or Files.</p>
      <a class="btn" href="#more/data">Backup and restore</a>
    <//>
    <${M} title="Need the same data on phone and computer?">
      <p>Use the claude.ai version of My Day. It saves to your claude.ai account. Move your data across with a backup file: save it here, then restore it there.</p>
      <p class="hint">Address (open while signed in to claude.ai): <span class="select">${$s}</span></p>
      <a class="btn secondary" href=${$s} target="_blank" rel="noopener noreferrer">Open the claude.ai version</a>
    <//>
  </div>`}function gs(){if(N)return i`<${Bi} />`;if(ae)return i`<${qi} />`;C();let e=U(),[t,n]=v(""),[o,a]=v(""),[s,r]=v(!1),[l,d]=v(""),[u,c]=v(""),p=async m=>{m.preventDefault(),r(!0),a("");try{await Ro(t),n(""),w("Signed in. Your data is syncing."),ee||zt()}catch($){a($.message)}r(!1)},h=async m=>{if(m.preventDefault(),t!==u){a("The two passwords are not the same.");return}r(!0),a("");try{await Oo(l,t),n(""),c(""),d(""),w("Password saved. You are signed in and your data is syncing.")}catch($){a($.message)}r(!1)},f=ze(e);return i`<div class="screen">
    <${B} title="Sign-in and sync" />
    <${vs} />
    <${M} title="Status">
      <p><span class=${"pill "+f.tone}>${f.text}</span></p>
      <ul class="plain">
        <li>Connection: ${e.online?"online":"offline"}</li>
        <li>Changes waiting to sync: ${e.pending}</li>
        <li>Last successful sync: ${Kt(e.lastSyncAt)}</li>
        ${e.lastError&&i`<li>Problem: ${e.lastError}</li>`}
      </ul>
      ${e.signedIn&&i`<div class="row"><button class="btn secondary" onClick=${()=>ie()} disabled=${e.syncing||!e.online}>Sync now</button></div>`}
      ${!e.online&&e.pending>0&&i`<p class="hint">Your changes are saved on this device and will sync when you are back online.</p>`}
    <//>
    ${e.signedIn?i`<${M} title="Account">
        <p>${ee?"You are signed in. Your data is saved in your own Cloudflare database and stays in step on every signed-in device, usually within a few seconds.":"You are signed in. Your data is backed up to your server."}</p>
        <button class="btn quiet" onClick=${async()=>{e.pending&&!await Y(`${e.pending} changes have not synced yet. They stay on this device, but will not reach the server until you sign in again. Sign out anyway?`,{ok:"Sign out"})||(await Lo(),w("Signed out"))}}>Sign out</button>
      <//>`:ee&&!e.passwordSet?i`<${M} title="Create your password">
        <p>First time here: choose the password you will use on your phone and computer. You need the one-time setup code you were given.</p>
        <form class="stack" onSubmit=${h}>
          <${b} label="Setup code" id="su-code"><input id="su-code" autocomplete="one-time-code" autocapitalize="characters" value=${l} onInput=${m=>d(m.currentTarget.value)} placeholder="XXXX-XXXX-XXXX" /><//>
          <${b} label="New password" id="su-pw" hint="At least 10 characters."><input id="su-pw" type="password" autocomplete="new-password" value=${t} onInput=${m=>n(m.currentTarget.value)} /><//>
          <${b} label="Type it again" id="su-pw2"><input id="su-pw2" type="password" autocomplete="new-password" value=${u} onInput=${m=>c(m.currentTarget.value)} /><//>
          ${o&&i`<p class="status-msg" role="alert">${o}</p>`}
          <button class="btn" type="submit" disabled=${s||!l.trim()||t.length<10||!u||!e.online}>Save password and sign in</button>
        </form>
      <//>`:i`<${M} title="Sign in">
        <p>Sign in to back up your data and use it on more than one device. Until then, everything is saved on this device only.</p>
        ${Ge()&&!gt()&&i`<p class="note">On iPhone, Safari and the Home Screen app keep separate storage. If you plan to use the Home Screen app, sign in there.</p>`}
        <form class="stack" onSubmit=${p}>
          <${b} label="Password" id="si-pw"><input id="si-pw" type="password" autocomplete="current-password" value=${t} onInput=${m=>n(m.currentTarget.value)} /><//>
          ${o&&i`<p class="status-msg" role="alert">${o}</p>`}
          <button class="btn" type="submit" disabled=${s||!t||!e.online}>${e.online?"Sign in":"Offline \u2014 cannot sign in"}</button>
        </form>
      <//>`}
  </div>`}async function bs(e,t){if(N){let r=await window.claude?.use?.("downloads");if(!r)throw new Error("Saving files is not available here. Use \u201CCopy backup\u201D instead.");try{return await r.save({filename:e,data:JSON.stringify(t,null,2)}),!0}catch(l){if(l?.code==="declined")return!1;throw new Error(l?.code==="rate_limited"?"A save prompt is already open. Please try again in a moment.":"The file could not be saved here. Use \u201CCopy backup\u201D instead.")}}let n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),o=new File([n],e,{type:"application/json"});if(navigator.canShare?.({files:[o]}))try{return await navigator.share({files:[o],title:e}),!0}catch(r){if(r.name==="AbortError")return!1}let a=URL.createObjectURL(n),s=Object.assign(document.createElement("a"),{href:a,download:e});return document.body.append(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e4),!0}var ks="myday-last-export",Wi=()=>{try{return Number(localStorage.getItem(ks))||0}catch{return 0}};function ws(){C();let e=U(),[t,n]=v(null),[o,a]=v(null),[s,r]=v(""),[l,d]=v(""),[u,c]=v(Wi()),p=()=>{try{localStorage.setItem(ks,String(Date.now()))}catch{}c(Date.now())},h=async()=>{d("");try{await bs(`myday-backup-${k()}.json`,ln())&&(p(),w("Backup file saved"))}catch(y){d(y.message)}},f=async()=>{d("");try{await navigator.clipboard.writeText(JSON.stringify(ln())),p(),w("Backup copied. Paste it into a note or file to keep it.")}catch{d("Copying is not allowed here. Use \u201CSave a backup file\u201D.")}},m=async()=>{try{await bs(`myday-cloud-${k()}.json`,await V("/api/export"))}catch(y){d(y.message)}},$=async y=>{r(""),n(null),a(null);let S=y.currentTarget.files?.[0];if(S)try{let R=JSON.parse(await S.text());a(cn(R)),n(R)}catch(R){r(R instanceof SyntaxError?"This file could not be read as a backup.":R.message)}},g=async y=>{if(y==="replace"&&!await Y("Replace everything with this backup? Items not in the backup will be removed from this device"+(e.signedIn?" and from the cloud.":"."),{ok:"Replace everything"}))return;let S=await Fo(t,y);Le(),n(null),a(null),w(`Restore complete: ${S} item${S===1?"":"s"} updated`)};return i`<div class="screen">
    <${B} title="Backup and restore" />
    <${M} title="Where your data is kept">
      <ul class="plain">
        <li>On this device (works offline).</li>
        <li>${ae?"Only on this device \u2014 nothing is sent to a server.":N?e.signedIn?"In your claude.ai account (private to you), saved automatically.":"Not in the cloud right now \u2014 it will be saved when your account is reachable.":e.signedIn?"On your server, synced automatically. The server also keeps a daily copy for 14 days.":"Not on a server yet \u2014 sign in to add a cloud copy."}</li>
        <li>In backup files you export (recommended once a week; keep them in iCloud Drive or Files).</li>
      </ul>
    <//>
    <${M} title="Export">
      <p class="hint">Last backup file from this device: ${u?Kt(u):"none yet"}</p>
      <div class="action-grid">
        <button class="btn" onClick=${h}>Save a backup file</button>
        ${N&&i`<button class="btn secondary" onClick=${f}>Copy backup</button>`}
        ${!N&&e.signedIn&&e.online&&i`<button class="btn secondary" onClick=${m}>Download the cloud copy</button>`}
      </div>
      ${l&&i`<p class="status-msg" role="alert">${l}</p>`}
    <//>
    <${M} title="Restore">
      <label class="btn secondary file-btn">Choose a backup file<input type="file" accept="application/json,.json" onChange=${$} /></label>
      ${s&&i`<p class="status-msg" role="alert">${s}</p>`}
      ${o&&i`<div class="stack">
        <p>This backup contains: ${Object.entries(o).map(([y,S])=>`${S} ${Bn[y]||y}`).join(", ")}. Exported ${t.exportedAt?new Date(t.exportedAt).toLocaleString("en-IN",{timeZone:X()}):""}.</p>
        <button class="btn" onClick=${()=>g("merge")}>Add missing and newer items</button>
        <button class="btn quiet" onClick=${()=>g("replace")}>Replace everything with this backup</button>
      </div>`}
    <//>
  </div>`}var Ui=(()=>{try{return Intl.supportedValuesOf("timeZone")}catch{return["Asia/Kolkata","Asia/Dubai","Asia/Singapore","Europe/London","America/New_York","UTC"]}})();function Ss(){C();let[e,t]=v(he()),n=Ie(e.quietStart)&&Ie(e.quietEnd);return i`<div class="screen">
    <${B} title="Settings" />
    <form class="card stack" onSubmit=${a=>{a.preventDefault(),n&&(ca(e),w("Settings saved"))}}>
      <${b} label="Time zone" id="st-tz" hint="The schedule, “today” and reminders all use this time zone.">
        <select id="st-tz" value=${e.tz} onChange=${a=>t({...e,tz:a.currentTarget.value})}>${Ui.map(a=>i`<option value=${a}>${a}</option>`)}</select>
      <//>
      <div class="row">
        <${b} label="Quiet hours start" id="st-qs"><input id="st-qs" type="time" value=${e.quietStart} onInput=${a=>t({...e,quietStart:a.currentTarget.value})} /><//>
        <${b} label="Quiet hours end" id="st-qe"><input id="st-qe" type="time" value=${e.quietEnd} onInput=${a=>t({...e,quietEnd:a.currentTarget.value})} /><//>
      </div>
      <p class="hint">Reminders that fall in quiet hours are held until quiet hours end.</p>
      <div class="sheet-actions"><button class="btn" type="submit" disabled=${!n}>Save settings</button></div>
    </form>
  </div>`}function Hi(){return i`<div class="screen">
    <${B} title="Add to Home Screen" />
    <${M} title="On iPhone">
      <ol class="steps">
        <li>Open your My Day link in <strong>Safari</strong> and sign in to claude.ai if asked.</li>
        <li>Tap the <strong>Share</strong> button (square with an arrow).</li>
        <li>Tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
        <li>Open My Day from its icon. It opens through claude.ai, so you stay signed in there.</li>
      </ol>
      <p class="hint">Your data is saved to your claude.ai account, so it is the same in Safari, the Claude app and on your computer.</p>
    <//>
    <${M} title="On a computer">
      <p>Bookmark the link, or pin the tab.</p>
    <//>
  </div>`}function _s(){if(N)return i`<${Hi} />`;let e=gt();return i`<div class="screen">
    <${B} title="Add to Home Screen" />
    ${e?i`<${M}><p><strong>You are using the Home Screen app.</strong>${De?"":i` You can now <a href="#more/notifications">turn on notifications</a>.`}</p><//>`:""}
    <${M} title="On iPhone (iOS 16.4 or later)">
      <ol class="steps">
        <li>Open My Day in <strong>Safari</strong> (not inside another app’s browser).</li>
        <li>Tap the <strong>Share</strong> button (square with an arrow).</li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
        <li>Close Safari and open <strong>My Day</strong> from its Home Screen icon.</li>
        ${ae?i`<li>Use My Day from the Home Screen icon from now on. It keeps its own storage, separate from Safari, and works offline.</li>`:i`<li>Sign in again inside the Home Screen app — it keeps its own storage, separate from Safari.</li>
        ${!De&&i`<li>Go to More → Reminders and notifications → <strong>Enable Notifications</strong>, then send a test.</li>`}`}
      </ol>
      ${Ge()&&!e&&i`<p class="note">You are viewing this in the browser. ${ae?"Add it to the Home Screen so it works offline and keeps its data in one place.":De?"Add it to the Home Screen so it opens like an app and works offline.":"Notifications on iPhone need the Home Screen app."}</p>`}
    <//>
    <${M} title="On a computer or Android">
      <p>In Chrome or Edge, use the install icon in the address bar, or the menu → Install My Day. On Android, use the menu → Add to Home screen.</p>
    <//>
  </div>`}var Vi=[["morning","Morning check"],["closing","Closing check"]],ji=()=>new Date().toLocaleString("en-GB",{timeZone:X(),hour:"2-digit",hour12:!1})<"12"?"morning":"closing";function Yi({minutes:e}){let[t,n]=v(null),[,o]=v(0);if(z(()=>{if(!t)return;let s=setInterval(()=>o(r=>r+1),1e3);return()=>clearInterval(s)},[t]),!t)return i`<button class="btn small secondary" onClick=${()=>n(Date.now()+e*6e4)}>Start ${e} min</button>`;let a=Math.max(0,Math.round((t-Date.now())/1e3));return i`<span class="timer" role="timer" aria-live="off">${a?`${Math.floor(a/60)}:${String(a%60).padStart(2,"0")} left`:"Time is up"}
    <button class="link-btn" onClick=${()=>n(null)}>${a?"Stop":"Reset"}</button></span>`}function zi({close:e}){let[t,n]=v(()=>JSON.parse(JSON.stringify(vn())));return i`<form class="stack" onSubmit=${a=>{a.preventDefault(),da(t),e(),w("Checklist updated")}}>
    ${t.sections.map((a,s)=>i`<fieldset class="field">
      <legend class="field-label">Section ${s+1}</legend>
      <input aria-label="Section title" value=${a.title} onInput=${r=>{t.sections[s].title=r.currentTarget.value,n({...t})}} />
      <label class="inline">Minutes <input type="number" min="1" max="60" inputmode="numeric" value=${a.minutes} onInput=${r=>{t.sections[s].minutes=Number(r.currentTarget.value)||10,n({...t})}} /></label>
      ${!a.decisions&&i`<textarea aria-label="Checklist items, one per line" rows="4" value=${a.items.join(`
`)} onInput=${r=>{t.sections[s].items=r.currentTarget.value.split(`
`).map(l=>l.trim()).filter(Boolean),n({...t})}}></textarea>
        <span class="hint">One item per line.</span>`}
    </fieldset>`)}
    <div class="sheet-actions"><button class="btn" type="submit">Save checklist</button></div>
  </form>`}function xs(){C();let e=k(),[t,n]=v(ji()),[o,a]=v(e),s=`${o}-${t}`,r=vn(),l=ve("office",s)||{date:o,slot:t,sections:{}},d=h=>I("office",s,{...l,...h,date:o,slot:t}),u=h=>l.sections?.[h]||{},c=(h,f)=>d({sections:{...l.sections,[h]:{...u(h),...f}}}),p=Te("office").filter(h=>h.id!==s).sort((h,f)=>f.id.localeCompare(h.id)).slice(0,10);return i`<div class="screen">
    <${B} title="Office check" />
    <${oe} label="Which check" value=${t} onChange=${n} options=${Vi} />
    <p class="hint">${o===e?"Today":L(o,{long:!0})} · 30 minutes in three parts. The timer only runs while the app is open.</p>
    ${o!==e&&i`<button class="link-btn" onClick=${()=>a(e)}>Back to today</button>`}
    ${r.sections.map(h=>i`<${M} key=${h.id} title=${`${h.title} \xB7 ${h.minutes} min`} action=${o===e&&i`<${Yi} minutes=${h.minutes} />`}>
      ${h.decisions?i`<${Ki} items=${u(h.id).decisions||[]} onChange=${f=>c(h.id,{decisions:f})} />`:i`<ul class="checklist">${h.items.map(f=>i`<li><label class="check-row">
          <input type="checkbox" checked=${!!u(h.id).checked?.[f]} onChange=${m=>c(h.id,{checked:{...u(h.id).checked,[f]:m.currentTarget.checked}})} />
          ${f}</label></li>`)}</ul>`}
      <${b} label="Notes" id=${"on-"+h.id}><textarea id=${"on-"+h.id} rows="2" value=${u(h.id).notes||""} onChange=${f=>c(h.id,{notes:f.currentTarget.value})}></textarea><//>
    <//>`)}
    <div class="row between">
      ${l.completedAt?i`<p class="calm">Check finished.</p>`:i`<button class="btn" onClick=${()=>{d({completedAt:Date.now()}),w("Office check finished")}}>Finish check</button>`}
      <button class="link-btn" onClick=${()=>T("Edit checklist",zi)}>Edit checklist</button>
    </div>
    ${p.length>0&&i`<${M} title="Earlier checks"><ul class="plain">${p.map(h=>i`<li><button class="link-btn" onClick=${()=>{a(h.date),n(h.slot)}}>
      ${q(h.date,e)} · ${h.slot==="morning"?"Morning":"Closing"}${h.completedAt?"":" (not finished)"}</button></li>`)}</ul><//>`}
  </div>`}function Ki({items:e,onChange:t}){let[n,o]=v({decision:"",owner:"",nextAction:""}),a=r=>{r.preventDefault(),n.decision.trim()&&(t([...e,{...n,id:W()}]),o({decision:"",owner:"",nextAction:""}))},s=r=>{let l=Be({title:r.decision,nextAction:r.nextAction,owner:r.owner,category:"Sitz Ergo",plannedDate:k()});t(e.map(d=>d.id===r.id?{...d,taskId:l.id}:d)),w("Added to today\u2019s tasks")};return i`<div class="stack">
    ${e.length>0&&i`<ul class="plain decisions">${e.map(r=>i`<li key=${r.id}>
      <strong>${r.decision}</strong>
      <span class="task-meta">${[r.owner&&`Owner: ${r.owner}`,r.nextAction&&`Next: ${r.nextAction}`].filter(Boolean).join(" \xB7 ")}</span>
      ${r.taskId?i`<span class="hint">Added as a task</span>`:i`<button class="link-btn" onClick=${()=>s(r)}>Create a task from this</button>`}
    </li>`)}</ul>`}
    <form class="stack" onSubmit=${a}>
      <input aria-label="Decision" placeholder="Decision" value=${n.decision} onInput=${r=>o({...n,decision:r.currentTarget.value})} />
      <div class="row">
        <input aria-label="Owner" placeholder="Owner" value=${n.owner} onInput=${r=>o({...n,owner:r.currentTarget.value})} />
        <input aria-label="Next action" placeholder="Next action" value=${n.nextAction} onInput=${r=>o({...n,nextAction:r.currentTarget.value})} />
      </div>
      <button class="btn small secondary" type="submit" disabled=${!n.decision.trim()}>Add decision</button>
    </form>
  </div>`}var Ji=e=>{try{let t=new URL(e);return t.protocol==="https:"||t.protocol==="http:"?t.href:null}catch{return null}};function Qi(e){let t=[`${e.title} (${Lt[e.format]||""})`];if(e.sourceLiveId){let n=ve("content",e.sourceLiveId);n&&t.push(`From live session: ${n.title}`)}if(e.refs?.length){t.push("","References:");for(let n of e.refs)t.push(`- ${n.url}${n.timestamps?` @ ${n.timestamps}`:""}${n.note?` \u2014 ${n.note}`:""}`)}return e.editorInstructions&&t.push("","Instructions:",e.editorInstructions),t.join(`
`)}function Ds({item:e,close:t}){let n=!e,[o,a]=v(()=>e?JSON.parse(JSON.stringify(e)):{id:W(),title:"",format:"recording",stage:"Idea",refs:[]}),s=(p,h)=>a(f=>({...f,[p]:h})),r=(p,h)=>s("refs",o.refs.map((f,m)=>m===p?{...f,...h}:f)),l=kn().filter(p=>p.format==="live"&&p.id!==o.id),d=p=>{p.preventDefault(),o.title.trim()&&(I("content",o.id,{...o,title:o.title.trim(),refs:(o.refs||[]).filter(h=>h.url||h.note),createdAt:o.createdAt||Date.now()}),t(),w(n?"Content item added":"Saved"))},u=async()=>{await Y("Delete this content item?",{ok:"Delete"})&&(ge("content",o.id),t())},c=async()=>{try{await navigator.clipboard.writeText(Qi(o)),w("Copied. Paste it into your own message to the editor.")}catch{w("Could not copy on this device.")}};return i`<form class="stack" onSubmit=${d}>
    <${b} label="Title" id="ce-title"><input id="ce-title" data-autofocus=${n} value=${o.title} onInput=${p=>s("title",p.currentTarget.value)} /><//>
    <${b} label="Format" id="ce-format" hint="A standalone recording and an edit of a live session are tracked separately.">
      <select id="ce-format" value=${o.format} onChange=${p=>s("format",p.currentTarget.value)}>${Object.entries(Lt).map(([p,h])=>i`<option value=${p}>${h}</option>`)}</select>
    <//>
    ${o.format==="liveEdit"&&i`<${b} label="Which live session?" id="ce-src">
      <select id="ce-src" value=${o.sourceLiveId||""} onChange=${p=>s("sourceLiveId",p.currentTarget.value)}>
        <option value="">Not linked</option>${l.map(p=>i`<option value=${p.id}>${p.title}</option>`)}</select><//>`}
    <${b} label="Stage" id="ce-stage"><select id="ce-stage" value=${o.stage} onChange=${p=>s("stage",p.currentTarget.value)}>${te.map(p=>i`<option value=${p}>${p}</option>`)}</select><//>
    <div class="row">
      <${b} label="Planned date" id="ce-pd"><input id="ce-pd" type="date" value=${o.plannedDate||""} onInput=${p=>s("plannedDate",p.currentTarget.value)} /><//>
      <${b} label=${o.format==="recording"?"Recording date":"Live date"} id="ce-ld"><input id="ce-ld" type="date" value=${o.eventDate||""} onInput=${p=>s("eventDate",p.currentTarget.value)} /><//>
    </div>
    <fieldset class="field"><legend class="field-label">References and timestamps</legend>
      ${(o.refs||[]).map((p,h)=>i`<div class="ref-edit">
        <input type="url" inputmode="url" aria-label="Link" placeholder="https://…" value=${p.url||""} onInput=${f=>r(h,{url:f.currentTarget.value.trim()})} />
        <div class="row">
          <input aria-label="Timestamps" placeholder="Timestamps, e.g. 02:15–03:40" value=${p.timestamps||""} onInput=${f=>r(h,{timestamps:f.currentTarget.value})} />
          <button type="button" class="icon-btn" aria-label="Remove reference" onClick=${()=>s("refs",o.refs.filter((f,m)=>m!==h))}>✕</button>
        </div>
        <input aria-label="Note" placeholder="Note" value=${p.note||""} onInput=${f=>r(h,{note:f.currentTarget.value})} />
      </div>`)}
      <button type="button" class="link-btn" onClick=${()=>s("refs",[...o.refs||[],{url:"",timestamps:"",note:""}])}>+ Add reference</button>
    </fieldset>
    <${b} label="Editor (optional)" id="ce-ed" hint="Assigning an editor here does not send them anything."><input id="ce-ed" value=${o.editor||""} onInput=${p=>s("editor",p.currentTarget.value)} /><//>
    <${b} label="Instructions for the editor" id="ce-ins"><textarea id="ce-ins" rows="4" value=${o.editorInstructions||""} onInput=${p=>s("editorInstructions",p.currentTarget.value)}></textarea><//>
    <button type="button" class="btn small secondary" onClick=${c}>Copy instructions to share myself</button>
    <${b} label="Published link" id="ce-pub"><input id="ce-pub" type="url" inputmode="url" value=${o.publishedUrl||""} onInput=${p=>s("publishedUrl",p.currentTarget.value.trim())} /><//>
    <${b} label="Notes" id="ce-notes"><textarea id="ce-notes" rows="3" value=${o.notes||""} onInput=${p=>s("notes",p.currentTarget.value)}></textarea><//>
    <p class="hint">Video files are not stored here — keep links to where they live.</p>
    <div class="sheet-actions">
      ${!n&&i`<button type="button" class="btn quiet" onClick=${u}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!o.title.trim()}>Save</button>
    </div>
  </form>`}function Ts(){C();let[e,t]=v(""),n=k(),o=kn(),a=o.filter(d=>d.stage!=="Published"),s=e?o.filter(d=>d.stage===e):a,r=Object.fromEntries(te.map(d=>[d,o.filter(u=>u.stage===d).length])),l=d=>{let u=te.indexOf(d.stage);u<te.length-1&&(I("content",d.id,{...d,stage:te[u+1]}),w(`Moved to ${te[u+1]}`))};return i`<div class="screen">
    <${B} title="Content" />
    <div class="row between"><button class="btn" onClick=${()=>T("New content item",Ds)}>+ New item</button></div>
    <${_e} label="Stage" options=${te.map(d=>[d,`${d}${r[d]?` ${r[d]}`:""}`])} value=${e} onChange=${t} />
    <p class="hint">${e?`Showing: ${e}`:"Showing everything not yet published."}</p>
    ${s.length?i`<ul class="content-list">${s.sort((d,u)=>te.indexOf(d.stage)-te.indexOf(u.stage)||(d.plannedDate||"9").localeCompare(u.plannedDate||"9")).map(d=>i`<li key=${d.id} class="card content-item">
      <button class="content-main" onClick=${()=>T("Edit content",Ds,{item:d})}>
        <span class="task-title">${d.title}</span>
        <span class="task-meta">${[Lt[d.format],d.stage,d.plannedDate&&`Planned ${q(d.plannedDate,n)}`,d.editor&&`Editor: ${d.editor}`].filter(Boolean).join(" \xB7 ")}</span>
      </button>
      <div class="stage-bar" aria-hidden="true">${te.map((u,c)=>i`<span class=${c<=te.indexOf(d.stage)?"on":""}></span>`)}</div>
      ${d.refs?.length>0&&i`<ul class="refs">${d.refs.slice(0,3).map(u=>{let c=Ji(u.url);return i`<li>${c?i`<a href=${c} target="_blank" rel="noopener noreferrer">${new URL(c).hostname}</a>`:u.note}${u.timestamps?` @ ${u.timestamps}`:""}</li>`})}</ul>`}
      ${d.stage!=="Published"&&i`<button class="btn small secondary" onClick=${()=>l(d)}>Move to ${te[te.indexOf(d.stage)+1]}</button>`}
    </li>`)}</ul>`:i`<${ce}>${e?`Nothing in ${e}.`:"No content in progress. Add an idea to start."}<//>`}
  </div>`}var Ms={schedule:ss,themes:is,routines:cs,notifications:hs,sync:gs,data:ws,settings:Ss,install:_s,office:xs,content:Ts,money:Rn};function Cs(){let[e="today",t,n]=location.hash.replace(/^#\/?/,"").split("/").map(decodeURIComponent);return{tab:["today","tasks","money","week","more"].includes(e)?e:"today",page:t,sub:n}}function Gi(){let[e,t]=v(Cs());return z(()=>{let n=()=>{t(Cs()),window.scrollTo(0,0)};return addEventListener("hashchange",n),()=>removeEventListener("hashchange",n)},[]),e}var Xi={today:i`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`,tasks:i`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5l1.8 1.8L9 5M4 12.5l1.8 1.8L9 11M4 18.5l1.8 1.8L9 17M12 7h8M12 13h8M12 19h8"/></svg>`,money:i`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.8" y="6" width="18.4" height="13" rx="3"/><path d="M2.8 10h18.4M16 14.5h2.2"/><path d="M6 6l8.5-3 1.4 3"/></svg>`,week:i`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,more:i`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg>`};function Zi({tab:e}){return i`<nav class="bottom-nav" aria-label="Main">
    ${[["today","Today"],["tasks","Tasks"],["money","Money"],["week","Week"],["more","More"]].map(([t,n])=>i`
      <a href=${"#"+t} class=${e===t?"on":""} aria-current=${e===t?"page":void 0}>${Xi[t]}<span>${n}</span></a>`)}
  </nav>`}function er({hidden:e}){C();let t=U().conflicts;return!t||e?null:i`<a class="banner" href="#more/sync">${t} item${t>1?"s were":" was"} changed on another device. Tap to choose which version to keep.</a>`}function tr(){let{tab:e,page:t,sub:n}=Gi(),o=s=>{location.hash=s},a;if(e==="today")a=i`<${es} />`;else if(e==="tasks")a=i`<${ts} sub=${t} cat=${n} go=${o} />`;else if(e==="week")a=i`<${ns} />`;else if(e==="money")a=i`<${Rn} asTab=${!0} />`;else if(Ms[t]){let s=Ms[t];a=i`<${s} sub=${n} />`}else a=i`<${Va} />`;return i`
    <div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
    <${er} hidden=${t==="sync"} />
    <main id="main">${a}</main>
    <${Zi} tab=${e} />
    <${Da} />
    <${Ta} />`}function nr(e){return e>=300&&e<540?"dawn":e>=540&&e<960?"day":e>=960&&e<1170?"evening":"night"}function or(){let e=()=>{document.documentElement.dataset.daypart=nr(Ot(X()))};e(),setInterval(e,6e4)}function ar(){let e=window.visualViewport;if(!e)return;let t=()=>{let n=Math.max(0,window.innerHeight-e.height-e.offsetTop);document.documentElement.style.setProperty("--kb",`${Math.round(n)}px`),document.documentElement.style.setProperty("--vvh",`${Math.round(e.height)}px`),document.body.classList.toggle("kb-open",n>80)};e.addEventListener("resize",t),e.addEventListener("scroll",t),t(),document.addEventListener("focusin",n=>{n.target.matches("input, textarea, select")&&setTimeout(()=>n.target.scrollIntoView({block:"center",behavior:"smooth"}),300)})}function sr(){let e=Date.now();setInterval(()=>{let t=Date.now(),n=wn({reminders:Ve(),tasks:Z(),settings:he()},e,t);e=t,n.length&&w(ga(n[n.length-1].textKey))},2e4)}function ir(){if(N||!("serviceWorker"in navigator))return;navigator.serviceWorker.register("sw.js").then(n=>{n.addEventListener("updatefound",()=>{let o=n.installing;o?.addEventListener("statechange",()=>{o.state==="installed"&&navigator.serviceWorker.controller&&w("A new version is ready.",{label:"Update",run:()=>o.postMessage("skipWaiting")})})})}).catch(()=>{});let e=!!navigator.serviceWorker.controller,t=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{e&&!t&&(t=!0,At().finally(()=>location.reload()))})}async function rr(){let e=document.getElementById("app");try{await To()}catch{e.innerHTML='<p class="boot-error">This browser is blocking local storage (private browsing?). My Day needs it to work offline.</p>';return}N?await xo:U().signedIn&&navigator.onLine&&await Promise.race([ie(),new Promise(n=>setTimeout(n,4e3))]),ua(),Le(),ar(),or(),e.textContent="",po(i`<${tr} />`,e),ir(),De?sr():U().signedIn&&zt();let t=k();setInterval(()=>{k()!==t&&(t=k(),Le())},6e4),document.addEventListener("visibilitychange",()=>{document.hidden||Le()})}rr();})();
