import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Checkbox, message, Spin } from 'antd';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class AssignCategories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      dirty: false
    };

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
        const tempArr = [];
        snapshot.docs.map(item => {
          tempArr.push(item.data());
          this.setState({
            categories: tempArr
          });
          return null;
        });
      });
  }

  handleChange = (name, color, i) => {
    let categoriesNew = [...this.state.categories];
    categoriesNew[i].selected = !categoriesNew[i].selected;
    categoriesNew[i].months = [
      ...this.state.categories[i].months,
      parseInt(this.props.match.params.month)
    ];
    this.setState({
      categories: categoriesNew
    });

    this.db
      .collection('users')
      .doc(this.props.match.params.id)
      .collection('categories')
      .doc(name)
      .update({
        selected: categoriesNew[i].selected,
        months: categoriesNew[i].months
      });

      message.success(`${name} Succesfully Added`);
  };

  render() {
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
          {this.state.categories.length > 0 ? categories : <div className="text-center mt-20"><Spin size="large" /></div>}
          <div className="text-center d-flex justify-content-center">
            <Link
              to={`/calendar/${this.props.match.params.year}/${this.props.match.params.month}/${this.props.match.params.id}`}
            >
              <strong className="colour-p">Go Back</strong>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default withFirebase(AssignCategories);
