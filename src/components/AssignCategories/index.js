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
    console.log('selected', this.state.categories);
    this.props.firebase.assignCategories(
      this.props.match.params.id,
      this.props.match.params.year,
      this.props.match.params.month,
      this.state.categories
    );
    this.props.history.goBack()
  };

  render() {
    console.log(this.state.categories, 'CATEGORISE');
    console.log(this.props, 'categories')
    let categories = this.state.categories.map((item, i) => {
      let style = {
        background:item.color
      }
      return (
        <div className="d-flex assign-cat justify-content-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={item.selected}
                color="primary"
                onChange={() => this.handleChange(i)}
                value={item.name}
              />
            }
          />
          <div style={style} class="align-self-center col-md-3">{item.name}</div>
        </div>
      );
    });

    return (
      <div id="assign-categories-wrapper">
        <form onSubmit={this.selectCategories} class="col-sm-6 d-flex flex-column mx-auto bg-white form-cat position-relative">
          <h5 className="cat-h5">Categories</h5>
          {this.state.categories.length > 0 && (
            categories
          )}
          <input type="submit" value="Save" class="align-self-center save-draft-btn submit-cat" />
        </form>
      </div>
    );
  }
}

export default compose(withFirebase(AssignCategories));
