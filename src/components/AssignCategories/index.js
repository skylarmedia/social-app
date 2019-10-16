import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class AssignCategories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      dirty: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { getClient } = this.props.location.state
    this.props.firebase.getSelectedCategoriesPre(getClient).then(snapshot => {
      let setArr = [...this.state.categories];
      snapshot.docs.map(item => {
        console.log("ITEM CAR", item)
        setArr.push(item.data());
      });

      this.setState({
        categories: setArr
      });
    });
  }

  handleChange = i => {
    let categories = [...this.state.categories];
    categories[i].selected = !categories[i].selected;
    console.log('cats', categories);
    console.log('HANDLE CHANGE', [
      ...this.state.categories[i].month,
      parseInt(this.props.match.params.month)
    ]);

    categories[i].month = [
      ...this.state.categories[i].month,
      parseInt(this.props.match.params.month)
    ];

    this.setState(
      {
        categories: categories,
        dirty: true
      },
      () => {
        console.log('inner state', categories);
      }
    );
  };

  selectCategories = e => {
    e.preventDefault();
    // this.setState({
    //   categores:
    // })
    // categories[i].months = [...this.state.categories[i].months, parseInt(this.props.match.params.month)];
    console.log('selected', this.state.categories);
    this.props.firebase.assignCategories(
      this.props.match.params.id,
      this.props.match.params.year,
      this.props.match.params.month,
      this.state.categories
    );
  };

  render() {
    console.log(this.state.categories, 'CATEGORISE')
    let categories = this.state.categories.map((item, i) => {
      return (
        <li>
          <FormControlLabel
            control={
              <Checkbox
                checked={item.selected}
                color="primary"
                onChange={() => this.handleChange(i)}
                value={item.name}
              />
            }
            label={item.name}
          />
        </li>
      );
    });

    return (
      <div id="assign-categories-wrapper">
        <form onSubmit={this.selectCategories}>
          <ul>{this.state.categories.length > 0 && categories}</ul>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default compose(withFirebase(AssignCategories));
