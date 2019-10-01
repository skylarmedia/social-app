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
    this.props.firebase.getSelectedCategories(localStorage.getItem('userId')).then(snapshot => {
      let setArr = [...this.state.categories];

      snapshot.docs.map(item => {
        setArr.push(item.data());
      });

      this.setState(
        {
          categories: setArr
        },
        () => {
          console.log(this.state);
        }
      );
    });
  }

  handleChange = i => {
    let categories = [...this.state.categories];
    categories[i].selected = !categories[i].selected;
    console.log(categories);
    this.setState({
      categories,
      dirty: true
    });
  };

  selectCategories = e => {
      e.preventDefault();
      alert('ran')
      this.props.firebase.assignCategories(this.props.match.params.id, this.props.match.params.year, this.props.match.params.month, this.state.categories)
  }

  render() {
    console.log('cats', this.state.categories);
    let categories = this.state.categories.map((item, i) => {
      return (
        <li>
          {item.name}
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

    return <div id="assign-categories-wrapper">
        <form onSubmit={this.selectCategories}>
            <ul>
                {this.state.categories.length > 0 && 
                    categories
                }
            
            </ul>
            <input type="submit" value="Submit" />
        </form>
        
    </div>;
  }
}

export default compose(withFirebase(AssignCategories));
