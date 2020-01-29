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
    let color = e.split('|||')[1];
    let name = e.split('|||')[0];
    this.props.getSelectedCategory(color, name);
  };

  componentDidMount() {
    this.props.firebase
      .getUserCategories(this.props.clientId, parseInt(this.props.month))
      .then(items => {
        const editCatArr = [];
        items.docs.map(item => {
          let currentCat = {};
          currentCat.color = item.data().color;
          currentCat.name = item.data().name;
          editCatArr.push(currentCat);
          return this.setState({
            categories: editCatArr
          });
        });
      });
  }

  render() {
    const options = this.state.categories.map((item, index) => {
      return (
        <option value={`${item.name}|||${item.color}`} key={index}>
          {item.name}
        </option>
      );
    });

    const styleSelect = {
      backgroundColor: this.props.color
    };

    return (
      <React.Fragment>
        <form className="main-edit-form" style={styleSelect}>
          <Select
            name="options"
            style={{ width: 120 }}
            onChange={this.currentCategory.bind(this)}
            placeholder={this.props.currentCat ? this.props.currentCat : 'Category'}
            suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow icon" />}
          >
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
