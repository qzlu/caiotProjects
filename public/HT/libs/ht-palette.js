!function(u,p,N){"use strict";var V="px",A="0",e="innerHTML",n="className",r=ht.Default,w=ht.Color,O=ht.Node,H="position",S="top",C="left",d=r.animate,k=r.getInternal(),i="width",A="0",t="none",J="max-height",Q="font",X="background",D="border-box",l="user-select",x="box-sizing",h="overflow",L=r.isTouchable,k=r.getInternal(),Z=w.titleIconBackground,y=r.scrollBarInteractiveSize,j=/msie 9/.test(u.navigator?u.navigator.userAgent.toLowerCase():""),M=null,f=function(){return document},b=function(M){return f().createElement(M)},E=function(){return b("div")},Y=function(){var O=E(),m=O.style;return m.msTouchAction=t,m.cursor="default",L&&m.setProperty("-webkit-tap-highlight-color","rgba(0, 0, 0, 0)",M),m.position="absolute",m.left=A,m.top=A,O},F=function(){return b("canvas")},g=function(){return document.body},m=function(F,y,V){F.style.setProperty(y,V,M)},U=function(v,N){v.style.removeProperty(N)},K=function(o,P,k){r.def(ht.widget[o],P,k)},s=function(m,A){m.appendChild(A)},I=function(t,z){t.removeChild(z)},$=r.eventListenerOptionsFalse,R=(r.eventListenerOptionsTrue,function(u,A,P,x){u.addEventListener(A,P,x?$:$)});k.addMethod(r,{paletteExpandIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:Z,rotation:3.14}]},paletteCollapseIcon:{width:16,height:16,comps:[{type:"triangle",rect:[4,4,10,8],background:Z}]},paletteTitleLabelColor:r.labelSelectColor,paletteTitleLabelFont:r.labelFont,paletteContentLabelFont:r.labelFont,paletteContentLabelColor:"#777",paletteContentBackground:"#fff",paletteTitleHeight:r.widgetTitleHeight,paletteTitleBackground:w.titleBackground,paletteTitleHoverBackground:w.titleBackground,paletteSeparatorWidth:1,paletteSeparatorColor:N,paletteItemHoverBorderColor:w.highlight,paletteItemSelectBackground:w.highlight},!0);var B=".palette-item:hover{border: 1px solid "+r.paletteItemHoverBorderColor+" !important}"+" .palette-header:hover{background: "+r.paletteTitleHoverBackground+" !important}",v=document.createElement("style");L||(v.styleSheet?v.styleSheet.cssText=B:v.appendChild(f().createTextNode(B))),f().getElementsByTagName("head")[0].appendChild(v);var q=function(Y){var C=this;C.$22h=Y,C.addListeners()};r.def(q,p,{ms_listener:1,getView:function(){return this.$22h.getView()},$26h:function(){var T=this;T.$36h&&g().removeChild(T.$36h),T.$23h=T.$24h=T.$25h=T.$35h=T.$36h=M},handle_touchstart:function(Q){for(var J,k=this,H=k.$22h,N=Q.target,q=H.sm(),D=H.dm(),x="palette-header",s="palette-header-tool",h="palette-item",U=!1,c=!1,i=!1;N&&(N[n]||"").indexOf(x)<0&&(N[n]||"").indexOf(h)<0;)N=N.parentNode;if(N&&N[n].indexOf(s)>=0?U=!0:N&&N[n].indexOf(x)>=0?i=!0:N&&N[n].indexOf(h)>=0&&(c=!0),r.isLeftButton(Q))if(k.$27h(Q))k.$24h=r.getClientPoint(Q),k.$25h=H.ty();else if(U){r.preventDefault(Q),J=N.parentNode.$11h;var t=D.getDataById(J),u=t.s("tools")[N.toolIndex];u.action&&u.action.call(H)}else if(i){r.preventDefault(Q),J=N.$11h;var t=D.getDataById(J);t.isExpanded()?t.setExpanded(!1):t.setExpanded(!0)}else if(c){J=N.$11h;var m=D.getDataById(J);q.ss(m),H.handleDragAndDrop&&(r.preventDefault(Q),m.s("draggable")&&(H.handleDragAndDrop(Q,"prepare"),k.$35h=0)),m.s("draggable")||(r.preventDefault(Q),k.$24h=r.getClientPoint(Q),k.$25h=H.ty())}else r.preventDefault(Q),k.$24h=r.getClientPoint(Q),k.$25h=H.ty();else k.$26h(Q)},handle_mousedown:function(I){this.handle_touchstart(I)},handle_mousewheel:function(u){this.handleScroll(u,u.wheelDelta/40,u.wheelDelta!==u.wheelDeltaX)},handle_DOMMouseScroll:function(A){this.handleScroll(A,-A.detail,1)},handleScroll:function(c,E,I){var B=this.$22h;r.preventDefault(c),I&&B._41o()&&B.ty(B.ty()+20*E)},handle_mouseup:function(r){this.handle_touchend(r)},handle_touchend:function(r){var d=this;d.$37h(r),d.$26h(r)},handleWindowMouseUp:function(r){this.handleWindowTouchEnd(r)},handleWindowTouchEnd:function(_){var g=this;g.$37h(_),g.$26h(_)},$37h:function(F){var h=this,$=h.$22h;2===h.$35h&&(h.$35h=3,$.handleDragAndDrop(F,"end"))},handleWindowMouseMove:function(j){this.handleWindowTouchMove(j)},handleWindowTouchMove:function(j){var x=this,a=x.$22h,S=x.$23h,B=x.$24h,N=x.$25h,$=r.getClientPoint(j),t=a._29I,q=x.$36h;if(1===x.$35h||2===x.$35h){if(x.$35h=2,a.handleDragAndDrop(j,"between"),L){var g=j.touches[0];j=g?g:j.changedTouches[0]}q.style.left=j.pageX-parseInt(q.width)/2+V,q.style.top=j.pageY-parseInt(q.height)/2+V}else"p"===S?a.ty(N+$.y-B.y):"v"===S&&a.ty(N+(B.y-$.y)/t.height*a._59I)},handle_mousemove:function(B){this.handle_touchmove(B)},handle_touchmove:function(q){if(!r.isDragging()&&r.isLeftButton(q)){var u=this,N=u.$22h,c=u.$27h(q);if(u.$24h){if(!u.$23h){if(r.getDistance(r.getClientPoint(q),u.$24h)<2)return;u.$23h=c?"v":"p",r.startDragging(u)}}else if(c)N._43o();else if(0===u.$35h){if(u.$35h=1,N.handleDragAndDrop(q,"begin"),L){var z=q.touches[0];q=z?z:q.changedTouches[0]}var Y=u.$36h=new Image,w=N.$10h[N.sm().ld().getId()].querySelector(".image-box"),M=parseInt(w.style.width),e=parseInt(w.style.height);Y.draggable=!1,Y.src=w.toDataURL(),Y.width=M,Y.height=e,Y.style.position="absolute",Y.style.left=q.pageX-M/2+V,Y.style.top=q.pageY-e/2+V,g().appendChild(Y),r.startDragging(u)}}},$27h:function(U){var N=this.$22h,d=N.getView(),n=d.getBoundingClientRect(),Z=N._29I,m=U.clientX-n.left+d.scrollLeft;return N._41o()&&Z.x+Z.width-m<y}}),ht.widget.Palette=function(p){var O=this,Z=O._view=k.createView(null,O);O.$9h={},O.$10h={},O.$4h={},O._29I={x:0,y:0,width:0,height:0},O._59I=0,O.dm(p?p:new ht.DataModel),Z[n]="ht-widget-palette",O.$29h=new q(O),m(Z,X,r.paletteContentBackground),m(Z,h,"auto"),m(Z,x,D),m(Z,"-moz-"+x,D),m(Z,"-webkit-"+l,t),m(Z,"-moz-"+l,t),m(Z,"-ms-"+l,t),m(Z,l,t),m(Z,"position","absolute"),m(Z,"overflow","hidden"),s(Z,O._79O=Y()),R(Z,"dragstart",function(k){k.dataTransfer&&(k.dataTransfer.setData("Text","nodeid:"+k.target.$11h),k.dataTransfer.effectAllowed="all",O.$29h.$26h())})},K("Palette",p,{ms_v:1,ms_fire:1,ms_dm:1,ms_sm:1,ms_vs:1,ms_ac:["itemImageWidth","itemImageHeight","itemImagePadding","itemMargin","layout","autoHideScrollBar","scrollBarSize","scrollBarColor"],$30h:0,_itemImagePadding:4,_itemImageWidth:70,_itemImageHeight:50,_itemMargin:10,_layout:"largeicons",_autoHideScrollBar:r.autoHideScrollBar,_scrollBarSize:r.scrollBarSize,_scrollBarColor:r.scrollBarColor,getViewRect:function(){return this._29I},ty:function(N){return N==M?this.getTranslateY():(this.setTranslateY(N),void 0)},setTranslateY:function(R){if(this.$32h==M){var s=this,T=s.$33h(R),$=s.$30h;s.$30h=T,s.fp("translateY",$,T)}},getTranslateY:function(){return this.$30h},setLayout:function(h){var w,M,j=this,N=j._layout;j._layout=h,"smallicons"===h?w=M=20:"iconsonly"===h?w=M=50:(w=70,M=50),j.setItemImageWidth(w),j.setItemImageHeight(M),j.setItemImagePadding(4),j.fp("layout",N,h)},getDataAt:function(n){for(var x=n.target;x&&x.$11h==M;)x=x.parentNode;return x&&x.$11h!=M?this.getDataModel().getDataById(x.$11h):void 0},$20h:function(){var u=16;return L&&(u*=1.2),u},$19h:function(){return r.paletteTitleHeight},$18h:function(){var A=r.paletteSeparatorWidth,l=r.paletteTitleBackground,H=r.paletteSeparatorColor||r.brighter(l);return A+V+" solid "+H},$17h:function(N){m(N,"cursor","pointer"),m(N,"display","inline-block"),m(N,"margin-right",(L?8:4)+V),m(N,"vertical-align",S)},$1h:function(p){var c=this,J=E(),Y=E(),L=b("span");J[n]="palette-header",m(J,H,"relative"),m(J,X,r.paletteTitleBackground),m(J,"color",r.paletteTitleLabelColor),m(J,S,A),m(J,x,D),m(J,"-moz-"+x,D),m(J,"padding","0 5px 0 0"),m(J,"border-top",c.$18h()),m(J,i,"100%"),m(J,"cursor","pointer"),m(J,"white-space","nowrap"),m(J,h,"hidden"),m(J,Q,r.paletteTitleLabelFont),m(J,"line-height",c.$19h()+V),J.$11h=p.getId();var o=F(),u=c.$19h(),P=c.$20h();c.$17h(o),k.setCanvas(o,P,u),s(J,o);var W=p.s("tools");if(W)for(var C=0;C<W.length;C++){var U=F();c.$17h(U),k.setCanvas(U,P,u),U[n]="palette-header-tool palette-header-tool"+p.getId()+"-"+C,U.style.position="absolute",U.style.right=(P+10)*C+"px",U.toolIndex=C,s(J,U)}return o[n]="palette-toggle-icon-"+p.getId(),Y[n]="palette-content",m(Y,"max-height",0+V),m(Y,Q,r.paletteContentLabelFont),m(Y,h,"hidden"),Y.$11h=p.getId(),c.$9h[p.getId()]=Y,L[e]=p.getName(),m(L,Q,r.paletteTitleLabelFont),s(J,o),s(J,L),[J,Y]},$2h:function(L){var o=this,O=o._layout,c=j&&L.s("draggable")?b("a"):E(),G=F(),u=E(),y=L.getName()||"",l=L.s("title")||L.getToolTip()||y,D=o._itemMargin;G[n]="image-box";var h=o.getItemImageWidth(),A=o.getItemImageHeight();return k.setCanvas(G,h,A),s(c,G),u[e]=y,u[n]="label-box","iconsonly"!==O&&s(c,u),c[n]="palette-item",m(c,"vertical-align",S),m(c,"cursor","pointer"),m(c,"border-radius",5+V),m(c,"border","1px solid transparent"),m(c,"text-align","center"),m(c,"display","inline-block"),m(c,"margin-left",D+V),m(c,"margin-top",D+V),m(c,"color",r.paletteContentLabelColor),"smallicons"===O?(m(G,"vertical-align","middle"),m(c,"margin-left",2+V),m(c,"margin-top",2+V),m(c,"padding",2+V),m(c,"text-align",C),m(u,"display","inline-block"),m(u,"min-width",o.$21h+o._itemMargin+V)):"largeicons"===O&&(m(u,"max-width",h+V),m(u,"overflow","hidden")),c.$11h=L.getId(),l&&(c.title=l),L.s("draggable")&&!o.handleDragAndDrop&&(j?(c.href="#",m(c,"text-decoration",t)):c.draggable="true"),c},$16h:function(m,T,D,p){var V=k.initContext(m);k.translateAndScale(V,0,0,1),V.clearRect(0,0,D,D);var Z=(D-p)/2;r.drawStretchImage(V,r.getImage(T),"fill",0,Z,p,p),V.restore()},$15h:function(i){var D=this,W=i.getId(),d=D._view.querySelector(".palette-toggle-icon-"+W),n=i.isExpanded()?r.paletteCollapseIcon:r.paletteExpandIcon;if(d&&n){var H=D.$19h(),h=D.$20h();D.$16h(d,n,H,h)}},_drawToolsIcon:function(e){var p=this,s=e.s("tools");if(s)for(var i=0;i<s.length;i++){var j=p._view.querySelector(".palette-header-tool"+e.getId()+"-"+i),Y=s[i].icon,S=p.$19h(),W=p.$20h();p.$16h(j,Y,S,W)}},$14h:function($){var n=this,B=$.getId(),H=n.$10h[B].querySelector(".image-box"),N=$.getImage(),m=$.s("image.stretch");if(H&&N){var O=k.initContext(H),w=n.getItemImagePadding();w="smallicons"===n._layout?w/2:w;var I=n.getItemImageWidth()-2*w,c=n.getItemImageHeight()-2*w;k.translateAndScale(O,0,0,1),O.clearRect(0,0,I,c),r.drawStretchImage(O,r.getImage(N),m,w,w,I,c,$,n),O.restore()}},validateImpl:function(){var U,N,x,P=this,R=P.$9h,G=P._layout,H=P.$10h,_=P.$4h,t=P._view,C=P.dm();if(P.$13h&&(delete P.$13h,_={},C.each(function(G){_[G.getId()]=G})),"smallicons"===G)for(var F in _){var B=_[F];if(B instanceof O){var X=B.getName()||"",n=r.getTextSize(r.paletteContentLabelFont,X).width;P.$21h!=M&&P.$21h>n||(P.$21h=n)}}for(var F in _){x=_[F];var Y,f;if(C.contains(x)){if(x instanceof ht.Group){var Q,K=P.$1h(x),Z=H[x.getId()];Z&&(Q=Z.nextSibling,I(t,Q),I(t,Z)),N=C.getSiblings(x).indexOf(x);var W=t.children[2*N]||P._79O;W&&W.parentNode?(t.insertBefore(K[0],W),t.insertBefore(Q||K[1],W)):(t.appendChild(K[0]),t.appendChild(Q||K[1])),H[x.getId()]=K[0],U=R[x.getId()]=Q||K[1],f=x.$12h;var m=x.s("promptText");f||(x.$12h=b("div"),x.$12h[e]=m||"",f=x.$12h),0===x.getChildren().size()?U.contains(f)||s(U,f):U.contains(f)&&I(U,f)}else if(Y=x.getParent()){var z=P.$2h(x),j=H[x.getId()];U=R[Y.getId()],j&&I(j.parentNode,j),N=C.getSiblings(x).indexOf(x);var L=U.children[N];L?U.insertBefore(z,L):s(U,z),H[x.getId()]=z,P.$14h(x)}}else{var v=H[x.getId()],u=v.parentNode;if(x instanceof ht.Group){var D=v.nextSibling;I(t,v),I(t,D),delete R[x.getId()]}else I(u,v),0===u.children.length&&(Y=C.getDataById(u.$11h),Y&&(f=Y.$12h,f&&!u.contains(f)&&s(u,f)));delete H[x.getId()]}}P.$4h={};var S=function(){var G=P._59I,g=0;P.$32h!=M&&(clearInterval(P.$32h),g=0,delete P.$32h),P.$32h=setInterval(function(){P.$31h(),G===P._59I?(g++,g>=2&&(clearInterval(P.$32h),delete P.$32h)):(g=0,G=P._59I)},30)};for(var w in R)if(U=R[w],x=C.getDataById(R[w].$11h),P.$15h(x),P._drawToolsIcon(x),x.isExpanded()){if(U.style.maxHeight===0+V){var g=U.scrollHeight+P._itemMargin+V;d(U).duration(200).set(J,g).set("padding-bottom",P._itemMargin+V).end(function(){return function(){S()}}(g))}else U.style.maxHeight=U.scrollHeight+V;U.style.paddingBottom=P._itemMargin+V}else U.style.maxHeight!==0+V&&d(U).duration(200).set(J,A).set("padding-bottom",A).end(function(){return function(){S()}}(U));P.$28h(),P.$31h()},$31h:function(){for(var R=this,j=R._view,O=0,Q=j.children,r=0;r<Q.length;r++){var x=Q[r];x.className&&x.className.indexOf("palette-")>=0&&(O+=x.offsetHeight)}R._59I=O,R.$30h=R.$33h(R.ty());var a=R.ty();j.scrollTop=-a,R._29I={x:0,y:-a,width:j.clientWidth,height:j.clientHeight},m(R._79O,S,-a+V),R._93I()},$33h:function(e){var S=this,r=S._29I.height-S._59I;return r>e&&(e=r),e>0?0:Math.round(e)},redraw:function(){this.$13h||(this.$13h=1,this.iv())},onPropertyChanged:function(B){["autoHideScrollBar","scrollBarSize","scrollBarColor","translateY"].indexOf(B.property)<0&&this.redraw(),"translateY"===B.property&&(this.iv(),this._43o())},findDataByName:function(Q){for(var i=this.dm().getDatas(),n=0;n<i.size();n++){var y=i.get(n);if(y.getName()===Q)return y}},setDataModel:function(U){var Y=this,R=Y._dataModel,o=Y._selectionModel;R!==U&&(R&&(R.umm(Y.$6h,Y),R.umd(Y.$8h,Y),R.umh(Y.$7h,Y),o||R.sm().ums(Y.$28h,Y)),Y._dataModel=U,U.mm(Y.$6h,Y),U.md(Y.$8h,Y),U.mh(Y.$7h,Y),o?o._21I(U):U.sm().ms(Y.$28h,Y),Y.sm().setSelectionMode("single"),Y.fp("dataModel",R,U))},$6h:function($){var x=this,A=x._view,M=$.data,k=x.$4h;"add"===$.kind?k[M.getId()]=M:"remove"===$.kind?k[M.getId()]=M:"clear"===$.kind&&(x.$10h={},x.$9h={},x.$4h={},A[e]=""),x.iv()},$7h:function(O){var t=this,W=O.data;t.$4h[W.getId()]=W,t.iv()},$8h:function(P){var C=this,G=P.data,U=P.property;"expanded"===U?C.iv():(C.$4h[G.getId()]=G,C.iv())},$28h:function(){var O,S=this,g=S.sm(),B="palette-item",D=g.ld();this.dm().each(function(R){O=S.$10h[R.getId()],O&&O[n].indexOf(B)>=0&&(R===D?m(O,X,r.paletteItemSelectBackground):U(O,X))})}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);