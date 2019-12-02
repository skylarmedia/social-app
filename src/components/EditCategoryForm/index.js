import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Select } from 'antd';

const { Option } = Select;


class EditCategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategory: ''
    };
  }

  currentCategory = e => {
    console.log('E', e)
      let color = e.split('|||')[1];
      let name = e.split('|||')[0];
      this.props.getSelectedCategory(color, name);
  };

  componentDidMount() {
    this.props.firebase
      .getUserCategories(this.props.clientId, parseInt(this.props.month))
      .then(items => {
        const editCatArr = [];
        items.docs.map((item, index) => {
          let currentCat = {};
          currentCat.color = item.data().color;
          currentCat.name = item.data().name;
          editCatArr.push(currentCat);
        });
        this.setState({
          categories: editCatArr
        });
      });
  }

  handleText = string => {
    if (string !== undefined) {
      return string.split('|||')[0];
    }
  };

  render() {
    const options = this.state.categories.map((item, index) => {
      if (this.handleText(this.props.category) == item.name) {
        return (
          <option value={`${item.name}|||${item.color}`} selected key={index}>
            {item.name}
          </option>
        );
      } else {
        return (
          <option value={`${item.name}|||${item.color}`} key={index}>
            {item.name}
          </option>
        );
      }
    });

    return (
      <React.Fragment>
        <form className="main-edit-form">
          <Select name="options" style={{ width: 120 }} onChange={this.currentCategory.bind(this)} placeholder="CATEGORY">
            {this.props.currentCat ? (
              <Option value={`${this.props.currentCat} ||| #fff`} selected>
                {this.props.currentCat}
              </Option>
            ) : (
              <Option value={`No Category ||| #fff`} selected>
                No Category
              </Option>
            )}
            {options}
          </Select>
        </form>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(EditCategoryForm));
