(this["webpackJsonpskylar-social"]=this["webpackJsonpskylar-social"]||[]).push([[5],{734:function(e,t,a){},735:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAAAXNSR0IArs4c6QAAAnRJREFUSA2tVkty00AQ7R4KFmRBdAJ8A7wMWZkqQrGLcwNzAnwDnBNgTgBHcHZUoCpiE7LDOQHiAtgs7Eo5WM3rkWYkWZIlk6hKNT09Pf3m87p7mBq+2cuDHpkHxyTUhWmXmPbtFKGQSCJiDmm1OAvC6XybK64bnB0dDuD0HRF36my8XmhOLGNaLT/UAZaAZr3uPj18fIGV6g52+xRQ1ifB16twc2IBCLuAcwZIejyb1m37Im+CL5ef8uYeKNnJ3s87g3jv8Ulw/n3iusYJ9GgvvD8QeBXzcfb6oOP8WyB78UTPnPJeWj3+2Lx3vtyORk5RbuVURP6U9U6zbZz7NjxgamavnvfBsKduWrGV0+D8coSL7FWC6aXruMT94rxcj40dw44SITeUicJvlYlg0LQEljLLkoizI8ompxLTsUqGRDqpqtxYmvOFB7tdqu015lj6tos57qgd/z46nDPzkzLKhmYjNtqBpD7i9QvTCkTtmQt0RTiMd8kepvKSS5tR1iEAP19Ffmi1GEK+9v0GweCSp9tsdCFKBI1yvSv8P/APbPJcLXqY2wz292ZqsP2oDsiDgHUKkuRBRqnAMbYFE/mliwK940kdEDONldoZCKLdfXmweD106orW+sepEMFRhFXWBe2IhIf1eVC2j4NxWjYc0ECPo2I1d1TJGTJHX53YXJfWjuZL3QHWstnE/khdUiXU/ep8toPzvCmzDPLh4IGUGUrjNnGVd1gp22SbFT21sXeUN7apRYvgf9QnGw7I5I1vhgKgvoKIRvVszKwtAEIBr6Bx61dQNj2RbOFKakpX8K7zuVHkGxYRIZOHdLuc1AE4f/8AzlcnPS+oe7sAAAAASUVORK5CYII="},736:function(e,t,a){"use strict";var s=a(9),n=a(10),o=a(12),c=a(11),r=a(0),l=a.n(r),i=a(14),d=a(34),p=a(727),m=p.a.Option,u=function(e){Object(o.a)(r,e);var t=Object(c.a)(r);function r(e){var a;return Object(s.a)(this,r),(a=t.call(this,e)).currentCategory=function(e){var t=e.split("|||")[1],s=e.split("|||")[0];a.props.getSelectedCategory(t,s)},a.state={categories:[],selectedCategory:""},a}return Object(n.a)(r,[{key:"componentDidMount",value:function(){var e=this;this.props.firebase.getUserCategories(this.props.clientId,parseInt(this.props.month)).then((function(t){var a=[];t.docs.map((function(t){var s={};return s.color=t.data().color,s.name=t.data().name,a.push(s),e.setState({categories:a})}))}))}},{key:"render",value:function(){var e=this.state.categories.map((function(e,t){return l.a.createElement("option",{value:"".concat(e.name,"|||").concat(e.color),key:t},e.name)})),t={backgroundColor:this.props.color};return l.a.createElement(l.a.Fragment,null,l.a.createElement("form",{className:"main-edit-form",style:t},l.a.createElement(p.a,{name:"options",style:{width:120},onChange:this.currentCategory.bind(this),placeholder:this.props.currentCat?this.props.currentCat:"Category",suffixIcon:l.a.createElement("img",{src:a(112),alt:"arrow icon"})},this.props.currentCat?l.a.createElement(m,{value:"".concat(this.props.currentCat," ||| #fff"),selected:!0},this.props.currentCat):l.a.createElement(m,{value:"No Category ||| #fff",selected:!0},"No Category"),e)))}}]),r}(r.Component);t.a=Object(d.a)(Object(i.c)(u))},741:function(e,t,a){},747:function(e,t,a){"use strict";a.r(t);var s=a(24),n=a(9),o=a(10),c=a(29),r=a(12),l=a(11),i=a(0),d=a.n(i),p=a(736),m=a(250),u=a(169),h=(a(741),a(729)),g=a(750),b=a(340),f=a(733),v=a(724),E=a(730),C=a(726),y=a(339),k=a(65),N=a(167),w=a(166),x=a.n(w),I=a(323),A=a(21),S=a.n(A),D=(a(734),a(14)),M=a(17),O=a.n(M),j=a(132),P=h.a.TextArea,T=g.a.Panel,Y=function(e){Object(r.a)(i,e);var t=Object(l.a)(i);function i(e){var a;return Object(n.a)(this,i),(a=t.call(this,e)).handlePostMedium=function(e){var t=e.target.getAttribute("index"),n=Object(s.a)(a.state.posts);n[t].postMedium=e.target.value,a.setState({posts:n})},a.handleVisibleChange=function(e){a.setState({visible:e})},a.handleHashTags=function(e){var t=e.target.getAttribute("index"),n=Object(s.a)(a.state.posts);n[t].postHashTag=e.target.value,a.setState({posts:n})},a.handleTitle=function(e){var t=e.target.getAttribute("index"),n=Object(s.a)(a.state.posts);n[t].title=e.target.value,a.setState({posts:n})},a.handleCopy=function(e){var t=e.target.getAttribute("index"),n=Object(s.a)(a.state.posts);n[t].copy=e.target.value,a.setState({posts:n})},a.unsubscribe=function(){return a.db.collection("chats").doc(a.props.match.params.postId).collection("messages").where("postId","==",a.props.match.params.clientId).onSnapshot((function(e){var t=Object(s.a)(a.state.messages);e.docChanges().forEach((function(e){"added"===e.type&&(t.push(e.doc.data()),a.setState({messages:t}))}))}))},a.deletePostParent=function(e){a.setState({messages:a.state.messages.filter((function(t,a){return a!==e}))})},a.submitEdits=function(){a.props.firebase.updatePost(a.props.match.params.postId,a.props.match.params.clientId,a.state.posts,a.state.approved),a.props.history.goBack()},a.handleFacebook=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].facebook=!n[t].facebook,a.setState({posts:n})},a.handleInstagram=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].instagram=!n[t].instagram,a.setState({posts:n})},a.handleTwitter=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].twitter=!n[t].twitter,a.setState({posts:n})},a.handleLinkedin=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].linkedin=!n[t].linkedin,a.setState({posts:n})},a.handleApproval=function(e){a.setState({approved:!a.state.approved})},a.handleOther=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].other=!n[t].other,a.setState({posts:n})},a.handleAd=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].ad=!n[t].ad,a.setState({posts:n})},a.handleComplete=function(e){var t=Object(s.a)(a.state.posts);t[e].postTime=a.state.currentTime,a.setState({posts:t})},a.handlePostTime=function(e,t){a.setState({currentTime:t})},a.toggleChat=function(){a.state.updatedMessages,a.setState({showChat:!a.state.showChat})},a.submitMessage=function(e){e.preventDefault()},a.handleBudget=function(e){},a.captureKey=function(e){"Enter"===e.key&&(e.preventDefault(),a.props.firebase.adminSendMessage(!0,S()(new Date).format("DD/MM/YYYY"),a.formatAMPM(new Date),a.props.match.params.postId,a.state.message,a.props.match.params.clientId,S()().unix(),a.state.currentMonth,a.state.currentYear,null),a.setState({message:""})),a.props.firebase.updateClientNotification(a.props.match.params.postId,a.props.match.params.clientId)},a.handleAd=function(e){var t=e.target.index,n=Object(s.a)(a.state.posts);n[t].ad=!n[t].ad,a.setState({posts:n})},a.addEmoji=function(e){if(e.unified.length<=5){var t=String.fromCodePoint("0x".concat(e.unified));a.setState({message:a.state.message+t})}else{var s=e.unified.split("-"),n=[];s.forEach((function(e){return n.push("0x"+e)}));var o=String.fromCodePoint.apply(String,n);a.setState({message:a.state.message+o})}},a.getSelectedCategoryParent=function(e,t){a.setState({selectedCategory:e,selectedCategoryName:t})},a.setMessage=function(e){e.preventDefault(),a.setState({message:e.target.value})},a.formatAMPM=function(e){var t=e.getHours(),a=e.getMinutes(),s=t>=12?"pm":"am";return(t=(t%=12)||12)+":"+(a=a<10?"0"+a:a)+" "+s},a.clearMessages=function(e){var t=a.functions.httpsCallable("clearClientMessages"),s={};s.id=e,s.postId=a.state.postId,t(s),a.setState({messages:[]})},a.toggleIcon=function(e){a.setState({showIcons:!a.state.showIcons})},a.saveDraft=function(){a.db.collection("users").doc(a.props.match.params.postId).collection("posts").doc(a.props.match.params.clientId).update({draft:!0}).then((function(){a.props.history.push("/calendar/".concat(a.state.currentYear,"/").concat(a.state.currentMonth,"/").concat(a.props.match.params.postId))}))},a.deletePost=function(){a.db.collection("users").doc(a.props.match.params.postId).collection("posts").doc(a.props.match.params.clientId).delete().then((function(){b.a.success("Post Successfully Deleted"),a.props.history.push("/calendar/".concat(a.state.currentYear,"/").concat(a.state.currentMonth,"/").concat(a.props.match.params.postId))}),(function(e){b.a.success("Failed Deleting Post")}))},a.state={posts:[],currentTime:null,approved:!1,showChat:!1,showIcons:!0,message:"",messages:[],currentMonth:null,currentYear:null,updatedMessages:!1,postId:null,selectedCategory:null,selectedCategoryName:null,visible:!1,color:null},a.handleFacebook=a.handleFacebook.bind(Object(c.a)(a)),a.handleComplete=a.handleComplete.bind(Object(c.a)(a)),a.handlePostMedium=a.handlePostMedium.bind(Object(c.a)(a)),a.handleAd=a.handleAd.bind(Object(c.a)(a)),a.handleHashTags=a.handleHashTags.bind(Object(c.a)(a)),a.submitEdits=a.submitEdits.bind(Object(c.a)(a)),a.handleCopy=a.handleCopy.bind(Object(c.a)(a)),a.setMessage=a.setMessage.bind(Object(c.a)(a)),a.handleBudget=a.handleBudget.bind(Object(c.a)(a)),a.db=O.a.firestore(),a.functions=O.a.functions(),a}return Object(o.a)(i,[{key:"componentDidMount",value:function(){var e=this,t=this.functions.httpsCallable("updateAdminMessages"),a={};a.postId=this.props.match.params.clientId,a.userId=this.props.match.params.postId,t(a),this.props.firebase.editPostFirebase(this.props.match.params.clientId,this.props.match.params.postId).then((function(t){0===e.state.posts.length&&e.setState({posts:t.data().post,selectedCategoryName:t.data().selectedCategoryName,approved:t.data().approved,currentMonth:t.data().month,currentYear:t.data().year,postId:t.id,color:t.data().color})})),this.unsubscribe()}},{key:"componentWillUnmount",value:function(){this.unsubscribe()}},{key:"handleStartDpChange",value:function(e,t){var a=Object(s.a)(this.state.posts);a[t].budgetStart=S()(e).format("MM/DD/YYYY"),this.setState({posts:a})}},{key:"handleEndDpChange",value:function(e,t){var a=Object(s.a)(this.state.posts);a[t].budgetEnd=S()(e).format("MM/DD/YYYY"),this.setState({posts:a})}},{key:"createUI",value:function(){var e=this;return this.state.values.map((function(t,a){return d.a.createElement("div",{key:a},d.a.createElement("input",{type:"text",value:t.value||"",onChange:e.handleLinks.bind(e,a)}),d.a.createElement("input",{type:"button",value:"remove",onClick:e.removeClick.bind(e,a)}))}))}},{key:"removeClick",value:function(e){var t=Object(s.a)(this.state.values);t.splice(e,1),this.setState({values:t})}},{key:"addClick",value:function(e){this.setState((function(t){return{values:[].concat(Object(s.a)(t.posts[e].values),[{value:null}])}}))}},{key:"render",value:function(){var e=this,t=this.state.posts.map((function(t,s){return d.a.createElement(d.a.Fragment,{key:s},d.a.createElement("div",{className:"edit-form-main-wrapper",key:s},d.a.createElement(f.a,{className:"container d-flex row mx-auto p-0",gutter:30},d.a.createElement(v.a,{span:12},d.a.createElement(h.a,{className:"outlined-title blue-input",label:"Post Title",name:"title",index:s,value:e.state.posts[s].title,onChange:e.handleTitle,margin:"normal"}),d.a.createElement("div",null,e.state.posts[s].images.length>0?d.a.createElement(j.a,{imageSrc:e.state.posts[s].images,className:"upload-files-wrapper"}):d.a.createElement("div",{id:"red-outline-wrapper",className:"w-100 mb-20"},d.a.createElement("div",{className:"red-center"},d.a.createElement("input",{type:"file",multiple:!0,onChange:e.addFile,className:"red-dashed-input"})))),d.a.createElement(P,{className:"blue-input copy-input",placeholder:"Copy",name:"copy",value:e.state.posts[s].copy,onChange:e.handleCopy,margin:"normal",variant:"outlined",index:s})),d.a.createElement(v.a,{span:12},d.a.createElement("div",{className:"d-flex justify-content-between mb-20 edit-social-icons"},d.a.createElement("div",null,d.a.createElement(E.a,{type:"checkbox",name:"facebook",value:e.state.posts[s].facebook,checked:e.state.posts[s].facebook,onChange:e.handleFacebook,index:s,id:"facebook-".concat(s)}),d.a.createElement("label",{for:"facebook-".concat(s)},"Facebook")),d.a.createElement("div",null,d.a.createElement(E.a,{type:"checkbox",name:"instagram",value:e.state.posts[s].instagram,checked:e.state.posts[s].instagram,onChange:e.handleInstagram,index:s,id:"instagram-".concat(s)}),d.a.createElement("label",{for:"instagram-".concat(s)},"Instagram")),d.a.createElement("div",null,d.a.createElement(E.a,{type:"checkbox",name:"twitter",value:e.state.posts[s].twitter,checked:e.state.posts[s].twitter,onChange:e.handleTwitter,index:s,id:"twitter-".concat(s)}),d.a.createElement("label",{for:"twitter-".concat(s)},"Twitter")),d.a.createElement("div",null,d.a.createElement(E.a,{type:"checkbox",name:"linkedin",value:e.state.posts[s].linkedin,checked:e.state.posts[s].linkedin,onChange:e.handleLinkedin,index:s,id:"linkedin-".concat(s)}),d.a.createElement("label",{for:"linkedin-".concat(s)},"LinkedIn")),d.a.createElement("div",null,d.a.createElement(E.a,{type:"checkbox",name:"other",value:e.state.posts[s].other,checked:e.state.posts[s].other,onChange:e.handleOther,index:s,id:"other-".concat(s)}),d.a.createElement("label",{id:"other-".concat(s)},"Other"))),d.a.createElement("div",{className:"date-button-wrapper d-flex row justify-content-between"},d.a.createElement("div",{id:"choose-date-wrapper",className:"col-sm-4"},d.a.createElement(g.a,{className:"post-collapse"},d.a.createElement(T,{header:"POST DATE",extra:d.a.createElement("img",{src:a(112),alt:"arrow icon"}),showArrow:!1},d.a.createElement(x.a,{selected:e.state.dpDate,placeholderText:"Post Date",onChange:function(t){return e.handleDPChange(t)},customInput:d.a.createElement(N.a,{ipDate:e.state.posts[s].ipDate,placeholderText:"Post Date",handleIpChange:function(t){return e.handleIpChange(t,s)}}),dateFormat:"MM/dd/yyyy",showMonthDropdown:!0,showYearDropdown:!0,dropdownMode:"select"})))),d.a.createElement("div",{className:"col-sm-4"},d.a.createElement(I.a,{index:s,onOpenChange:function(){return e.handleComplete(s)},onChange:e.handlePostTime,placeholder:"POST TIME",defaultValue:S()("".concat(e.state.posts[s].postTime),"HH:mm:ss")})),d.a.createElement("div",{className:"col-sm-4"},d.a.createElement(h.a,{type:"text",placeholder:"POST MEDIUM",name:"postMedium",className:"blue-input",value:e.state.posts[s].postMedium,onChange:e.handlePostMedium,index:s}))),d.a.createElement("div",{className:"mt-20 edit-ad"},d.a.createElement("div",{className:"sponsored-label"},d.a.createElement(E.a,{checked:e.state.posts[s].ad,onChange:e.handleAd,id:"ad-".concat(s),index:s}),d.a.createElement("label",{className:"color-blue ad-edit",for:"ad-".concat(s)},"Ad or Sponsored Post")),e.state.posts[s].ad&&d.a.createElement("div",{className:"col-md-12 row mt-20 mb-20"},d.a.createElement("div",{className:" d-flex justify-content-between date-picker-wrapper flex-85 align-items-center inner-form-wrapper2 "},d.a.createElement(x.a,{selected:new Date(e.state.posts[s].budgetStart),placeholderText:"Post Date",onChange:function(t){return e.handleStartDpChange(t,s)},dateFormat:"MM/dd/yyyy",showMonthDropdown:!0,showYearDropdown:!0,dropdownMode:"select",className:"select-edit"}),d.a.createElement("span",null,"-"),d.a.createElement(x.a,{selected:new Date(e.state.posts[s].budgetEnd),placeholderText:"Post Date",onChange:function(t){return e.handleEndDpChange(t,s)},dateFormat:"MM/dd/yyyy",showMonthDropdown:!0,showYearDropdown:!0,dropdownMode:"select",className:"select-edit"})),d.a.createElement("div",{className:"d-flex flex-85 align-items-center mt-20"},d.a.createElement("label",{className:"budget-text"},"Budget"),d.a.createElement("input",{type:"text",value:e.state.posts[s].budget,placeholder:"$0.00",name:"budget",className:"budget-input",onChange:e.handleBudget,index:s})))),d.a.createElement("div",null,d.a.createElement(P,{placeholder:"Hashtags",value:e.state.posts[s].postHashTag,name:"postHashTag",onChange:e.handleHashTags,index:s,className:"blue-input"})),d.a.createElement("div",null,e.state.posts[s].values.map((function(t,n){return d.a.createElement("div",{key:n},d.a.createElement("div",{className:"d-flex align-self-center ant-link"},d.a.createElement(h.a,{className:"blue-input",placeholder:"ADD LINKS",name:"link-".concat(n),value:t.value||"",onChange:function(t){return e.handleLinks(t)},margin:"normal",variant:"outlined",index:n}),n===e.state.posts[s].values.length-1?d.a.createElement("button",{type:"button",onClick:function(){return e.addClick(s)},className:"clear-btn"},d.a.createElement("img",{src:a(341),alt:"select icon"})):d.a.createElement("button",{type:"button",onClick:function(){return e.removeClick(n)},className:"clear-btn"},d.a.createElement("img",{src:a(735),alt:"x-icon"}))))})))),d.a.createElement(f.a,{className:"edit-btn-wrapper",gutter:10},d.a.createElement(v.a,null,d.a.createElement("button",{onClick:e.saveDraft,className:"save-draft-btn color-red"},"SAVE DRAFT")),d.a.createElement(v.a,null,d.a.createElement("button",{onClick:e.submitEdits,className:"add-date-btn"},"SAVE")),d.a.createElement(v.a,{span:24,className:"mt-30 text-center"},d.a.createElement("button",{type:"button",className:"clear-btn p-blue",onClick:e.deletePost},d.a.createElement("u",null,"Delete Post")))))))})),s=d.a.createElement("button",{type:"button",className:"clear-btn d-flex",onClick:function(){return e.clearMessages(e.props.match.params.postId,e.props.match.params.clientId)}},d.a.createElement("i",{className:"fas fa-trash"}),d.a.createElement("span",{className:"ml-10"},"CLEAR"));return d.a.createElement("div",{className:"add-post edit-post"},d.a.createElement("p",{className:"heading text-center add-post-heading p-blue"},"Client ",this.props.match.params.postId," Calendar",d.a.createElement("br",null)),d.a.createElement("div",{className:""},d.a.createElement("div",{className:"d-flex approval-wrapper"},d.a.createElement("div",{className:"container d-flex align-items-center"},d.a.createElement(p.a,{clientId:this.props.match.params.postId,getSelectedCategory:this.getSelectedCategoryParent,category:this.state.selectedCategory,currentCat:this.state.selectedCategoryName,color:this.state.color}),d.a.createElement(E.a,{name:"approved",value:this.state.approved,onChange:this.handleApproval,checked:this.state.approved,id:"approvePost"}),d.a.createElement("label",{className:"color-blue m-0",htmlFor:"approvePost"},"APPROVE POST"))),this.state.posts.length>0?t:d.a.createElement("div",{class:"text-center mt-20"},d.a.createElement(C.a,{size:"large"}))),d.a.createElement("div",{className:"fixed-bottom container position_relative col-md-4"},d.a.createElement("div",{hidden:this.state.showChat},d.a.createElement("div",{className:"d-flex flex-column align-items-end"},d.a.createElement("div",{className:"inner-chat-log bg-white position-relative"},d.a.createElement(u.a,{deletePost:this.deletePostParent,adminClient:this.props.match.params.postId,messages:this.state.messages}),d.a.createElement("form",{onSubmit:this.submitMessage,className:"d-flex mt-30 position-relative"},d.a.createElement("textarea",{onChange:this.setMessage,value:this.state.message,onKeyDown:this.captureKey}),d.a.createElement("button",{type:"button",onClick:this.toggleIcon.bind(this),className:"clear-btn position-absolute happy-btn"},d.a.createElement("i",{className:"fas fa-smile-beam"})),d.a.createElement(y.a,{placement:"topRight",content:s,trigger:"click",className:"position-absolute",visible:this.state.visible,onVisibleChange:this.handleVisibleChange},d.a.createElement(k.a,{className:"clear-btn clear-message-button position-absolute send-clear"},d.a.createElement("i",{className:"fas fa-ellipsis-v"}))))),d.a.createElement("span",{className:this.state.showIcons?"hidden":"not-hidden"},d.a.createElement(m.a,{onSelect:this.addEmoji})))),d.a.createElement("button",{onClick:this.toggleChat,type:"button",className:"clear-btn"},d.a.createElement("img",{src:a(343),alt:"chatbox icon"}))))}}]),i}(i.Component);t.default=Object(D.c)(Y)}}]);
//# sourceMappingURL=5.ea581f86.chunk.js.map