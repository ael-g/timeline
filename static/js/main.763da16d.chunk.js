(this.webpackJsonptimeline=this.webpackJsonptimeline||[]).push([[0],{19:function(e,t,n){},20:function(e,t,n){},21:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n.n(c),a=n(10),s=n.n(a),i=(n(19),n(20),n(13)),o=n(11),d=n(14),l=(n(21),n(1));var u=function(){var e=Object(c.useState)({centuries:[],periods:[],people:[]}),t=Object(d.a)(e,2),n=t[0],r=t[1];return Object(c.useEffect)((function(){fetch("".concat("","/items.json")).then((function(e){return e.json()})).then((function(e){var t=function(e){var t=e.reduce((function(e,t){return t.end>e?t.end:e}),0),n=e.reduce((function(e,t){return t.start<e?t.start:e}),1e4);return{min:100*Math.floor(n/100),max:100*Math.ceil(t/100)}}(e.periods.concat(e.people)),n=t.min,c=t.max,a=function(e,t){for(var n=[],c=e;c<t;c+=100){var r=(c-e)/100,a=100/((t-e)/100),s=a*r;n.push({id:r,width:a,left:s,year:c})}return n}(n,c),s=function(e,t,n){var c,r=[],a=Object(o.a)(e);try{for(a.s();!(c=a.n()).done;){var s=c.value,i=100*(s.end-s.start)/(n-t),d=100*(s.start-t)/(n-t);r.push({width:i,left:d,name:s.name,start:s.start,end:s.end})}}catch(l){a.e(l)}finally{a.f()}return r}(e.periods,n,c),i=function(e,t,n){for(var c=[],r=0;r<e.length;r++){var a=e[r],s=100*(a.end-a.start)/(n-t),i=100*(a.start-t)/(n-t),o=12+38*r/e.length;c.push({width:s,left:i,name:a.name,start:a.start,end:a.end,marginTop:o})}return c}(e.people,n,c);r({min:n,max:c,centuries:a,periods:s,people:i})}))}),[]),Object(l.jsxs)("div",{className:"App",children:[n.centuries.map((function(e){return Object(l.jsx)("a",{href:"",className:"Centuries",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%")},children:e.year},e.year)})),n.periods.map((function(e){return Object(l.jsxs)("a",{href:"",className:"Periods",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%")},children:[Object(l.jsx)("div",{className:"Left",children:e.start}),Object(l.jsx)("div",{className:"Centered",children:e.name}),Object(l.jsx)("div",{className:"Right",children:e.end})]},e.start)})),n.people.map((function(e){return Object(l.jsxs)("a",{href:"",className:"People",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%"),marginTop:"".concat(e.marginTop,"%")},children:[Object(l.jsx)("div",{className:"Left",children:e.start}),Object(l.jsx)("div",{className:"Centered",children:e.name}),Object(l.jsx)("div",{className:"Right",children:e.end})]},e.start)}))]})};var f=function(){return Object(l.jsx)(i.a,{basename:"",children:Object(l.jsx)("div",{className:"App",children:Object(l.jsx)(u,{})})})},h=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,29)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),c(e),r(e),a(e),s(e)}))};s.a.render(Object(l.jsx)(r.a.StrictMode,{children:Object(l.jsx)(f,{})}),document.getElementById("root")),h()}},[[28,1,2]]]);
//# sourceMappingURL=main.763da16d.chunk.js.map