import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import { Checkbox } from 'antd';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class AssignCategories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      dirty: false
    };

    // this.handleChange = this.handleChange.bind(this);
    this.db = firebase.firestore();
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.db
      .collection('users')
      .doc(id)
      .collection('categories')
      .get()
      .then(snapshot => {
        const tempNum = snapshot.size;
        const tempArr = new Array();
        snapshot.docs.map(item => {
          tempArr.push(item.data());
          console.log(tempNum, tempArr);
          if (tempNum == tempArr.length)
            this.setState(
              {
                categories: tempArr
              });
        });
      });
  }

  handleChange = (name, color, i) => {
    let categoriesNew = [...this.state.categories];
    categoriesNew[i].selected = !categoriesNew[i].selected;
    categoriesNew[i].months = [...this.state.categories[i].months, parseInt(this.props.match.params.month)]
    this.setState({
      categories:categoriesNew
    })

    this.db
      .collection('users')
      .doc(this.props.match.params.id)
      .collection('categories')
      .doc(name)
      .update({
        selected: categoriesNew[i].selected,
        months: categoriesNew[i].months
      });
  
  };

  // handleChange = i => {
  //   let categories = [...this.state.categories];
  //   categories[i].selected = !categories[i].selected;
  //   // console.log('cats', categories);
  //   // console.log('HANDLE CHANGE', [
  //   //   ...this.state.categories[i].month,
  //   //   parseInt(this.props.match.params.month)
  //   // ]);

  //   // categories[i].month = [
  //   //   ...this.state.categories[i].month,
  //   //   parseInt(this.props.match.params.month)
  //   // ];

  //   this.setState(
  //     {
  //       categories: categories
  //     });
  // };'

  // isValid(selected, months) {
  //   console.log('this months', months, this.props.match.params.month)
  //   if(selected === true && months.includes(this.props.match.params.month)){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }


  render() {
    console.log(this.state.categories, 'CATEGORISE');
    console.log(this.props, 'categories');
    let categories = this.state.categories.map((item, i) => {
      let style = {
        background: item.color
      };
      return (
        <div className="d-flex assign-cat justify-content-center mb-10">
          <Checkbox
            checked={this.state.categories[i].selected}
            onChange={() => this.handleChange(item.name, item.color, i)}
            value={item.name}
            id={item.name}
          />
          <label style={style} className="align-self-center col-md-3 ml-10" for={item.name}>
            {item.name}
          </label>
        </div>
      );
    });

    return (
      <div id="assign-categories-wrapper">
        <form
          onSubmit={this.selectCategories}
          className="col-sm-6 d-flex flex-column mx-auto bg-white form-cat position-relative"
        >
          <h5 className="cat-h5">Categories</h5>
          {this.state.categories.length > 0 && categories}
          <div className="text-center d-flex justify-content-center">
          <Link className="align-items-center save-draft-btn submit-cat d-flex justify-content-center color-red fw-16" to={`/calendar/${this.props.match.params.year}/${this.props.match.params.month}/${this.props.match.params.id}`}>SAVE</Link>
          </div>
         </form>
      </div>
    );
  }
}

export default compose(withFirebase(AssignCategories));
