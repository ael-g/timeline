(this.webpackJsonptimeline=this.webpackJsonptimeline||[]).push([[0],{19:function(e,t,n){},20:function(e,t,n){},21:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n.n(c),a=n(10),i=n.n(a),s=(n(19),n(20),n(13)),o=n(11),d=n(14),l=(n(21),n(1));var u=function(){var e=Object(c.useState)({centuries:[],periods:[],people:[]}),t=Object(d.a)(e,2),n=t[0],r=t[1];return Object(c.useEffect)((function(){fetch("".concat("/timeline","/items.json")).then((function(e){return e.json()})).then((function(e){var t=function(e){var t=e.reduce((function(e,t){return t.end>e?t.end:e}),0),n=e.reduce((function(e,t){return t.start<e?t.start:e}),1e4);return{min:100*Math.floor(n/100),max:100*Math.ceil(t/100)}}(e.periods.concat(e.people)),n=t.min,c=t.max,a=function(e,t){for(var n=[],c=e;c<t;c+=100){var r=(c-e)/100,a=100/((t-e)/100),i=a*r;n.push({id:r,width:a,left:i,year:c})}return n}(n,c),i=function(e,t,n){var c,r=[],a=Object(o.a)(e);try{for(a.s();!(c=a.n()).done;){var i=c.value,s=100*(i.end-i.start)/(n-t),d=100*(i.start-t)/(n-t);r.push({width:s,left:d,name:i.name,start:i.start,end:i.end})}}catch(l){a.e(l)}finally{a.f()}return r}(e.periods,n,c),s=function(e,t,n){for(var c=[],r=0;r<e.length;r++){var a=e[r],i=100*(a.end-a.start)/(n-t),s=100*(a.start-t)/(n-t),o=12+38*r/e.length;c.push({width:i,left:s,name:a.name,start:a.start,end:a.end,marginTop:o})}return c}(e.people,n,c);r({min:n,max:c,centuries:a,periods:i,people:s})}))}),[]),Object(l.jsxs)("div",{className:"App",children:[n.centuries.map((function(e){return Object(l.jsx)("a",{href:"",className:"Centuries",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%")},children:e.year},e.year)})),n.periods.map((function(e){return Object(l.jsxs)("a",{href:"",className:"Periods",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%")},children:[Object(l.jsx)("div",{className:"Left",children:e.start}),Object(l.jsx)("div",{className:"Centered",children:e.name}),Object(l.jsx)("div",{className:"Right",children:e.end})]},e.start)})),n.people.map((function(e){return Object(l.jsxs)("a",{href:"",className:"People",style:{width:"".concat(e.width,"%"),left:"".concat(e.left,"%"),marginTop:"".concat(e.marginTop,"%")},children:[Object(l.jsx)("div",{className:"Left",children:e.start}),Object(l.jsx)("div",{className:"Centered",children:e.name}),Object(l.jsx)("div",{className:"Right",children:e.end})]},e.start)}))]})};var f=function(){return Object(l.jsx)(s.a,{basename:"/timeline",children:Object(l.jsx)("div",{className:"App",children:Object(l.jsx)(u,{})})})},h=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,29)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),c(e),r(e),a(e),i(e)}))};i.a.render(Object(l.jsx)(r.a.StrictMode,{children:Object(l.jsx)(f,{})}),document.getElementById("root")),h()}},[[28,1,2]]]);
//# sourceMappingURL=main.0e99f1f3.chunk.js.map