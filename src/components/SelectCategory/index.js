import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import './index.css';

class SelectCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setCategories: [],
      name: '',
      categoryName: '',
      category: {},
      color: '#EF463B ',
      sendCategory: []
    };

    this.passCategories = this.passCategories.bind(this);
  }

  submitCategories = e => {
    e.preventDefault();
    let categoryObj = {};

    let sendCategory = {};

    categoryObj.color = this.state.color;
    categoryObj.name = this.state.name;

    // SendCategory sends category values up to parent
    sendCategory.color = this.state.color;
    sendCategory.name = this.state.name;
    sendCategory.selected = false;
    this.setState({
      setCategories: [...this.state.setCategories, categoryObj],
      sendCategory: [...this.state.sendCategory, sendCategory]
    });
  };

  handleChangeComplete = color => {
    this.setState({ color: color.hex });
  };

  selectCategory = e => {
    this.setState({
      name: e.target.value
    });
  };

  passCategories = e => {
    e.preventDefault();
    let catObj = new Object;
    catObj.name = this.state.name;
    catObj.color = this.state.color
    this.props.getCategories(catObj);
  };

  render() {
    let categoryList = this.state.setCategories.map((item, i) => {
      let categoryStyle = {
        background: item.color
      };
      return (
        <li key={i} className="category-list-item">
          <div className="d-flex align-items-center">
            <div className="hex-color" style={categoryStyle}>
              {item.name}
            </div>
          </div>
        </li>
      );
    });
    return (
      <React.Fragment>
        <form onSubmit={this.passCategories}>
          <input
            type="text"
            onChange={this.selectCategory.bind(this)}
            className="light-input"
            placeholder="CATEGORY_NAME"
          />
          <SketchPicker
            color={this.state.color}
            onChangeComplete={this.handleChangeComplete.bind(this)}
          />
          <div className="d-flex flex-column justify-content align-items-center">
            <ul id="selected-categories">{categoryList}</ul>
            {/* <button onClick={this.submitCategories} className="gen-red-btn">
              Add Categories
            </button>
            <br /> */}
            <button onClick={this.passCategories} className="gen-red-btn">
              Submit
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(SelectCategory));
