(this["webpackJsonpskylar-social"]=this["webpackJsonpskylar-social"]||[]).push([[10],{748:function(e,t,a){"use strict";a.r(t);var c=a(24),s=a(9),n=a(10),r=a(12),o=a(11),l=a(0),i=a.n(l),m=a(14),d=a(340),h=a(730),u=a(726),p=a(286),g=a.n(p),f=a(22),b=function(e){Object(r.a)(a,e);var t=Object(o.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).handleChange=function(e,t,a){var s=Object(c.a)(n.state.categories);s[a].selected=!s[a].selected,s[a].months=[].concat(Object(c.a)(n.state.categories[a].months),[parseInt(n.props.match.params.month)]),n.setState({categories:s}),n.db.collection("users").doc(n.props.match.params.id).collection("categories").doc(e).update({selected:s[a].selected,months:s[a].months}),d.a.success("".concat(e," Succesfully Added"))},n.state={categories:[],dirty:!1},n.db=g.a.firestore(),n}return Object(n.a)(a,[{key:"componentDidMount",value:function(){var e=this,t=this.props.match.params.id;this.db.collection("users").doc(t).collection("categories").get().then((function(t){var a=[];t.docs.map((function(t){return a.push(t.data()),e.setState({categories:a}),null}))}))}},{key:"render",value:function(){var e=this,t=this.state.categories.map((function(t,a){var c={background:t.color};return i.a.createElement("div",{className:"d-flex assign-cat justify-content-center mb-10"},i.a.createElement(h.a,{checked:e.state.categories[a].selected,onChange:function(){return e.handleChange(t.name,t.color,a)},value:t.name,id:t.name}),i.a.createElement("label",{style:c,className:"align-self-center col-md-3 ml-10",for:t.name},t.name))}));return i.a.createElement("div",{id:"assign-categories-wrapper"},i.a.createElement("form",{onSubmit:this.selectCategories,className:"col-sm-6 d-flex flex-column mx-auto bg-white form-cat position-relative"},i.a.createElement("h5",{className:"cat-h5"},"Categories"),this.state.categories.length>0?t:i.a.createElement("div",{className:"text-center mt-20"},i.a.createElement(u.a,{size:"large"})),i.a.createElement("div",{className:"text-center d-flex justify-content-center"},i.a.createElement(f.b,{to:"/calendar/".concat(this.props.match.params.year,"/").concat(this.props.match.params.month,"/").concat(this.props.match.params.id)},i.a.createElement("strong",{className:"colour-p"},"Go Back")))))}}]),a}(l.Component);t.default=Object(m.c)(b)}}]);
//# sourceMappingURL=10.9d5de5fa.chunk.js.map