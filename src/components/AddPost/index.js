import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import FileUploader from 'react-firebase-file-uploader';
import TimePicker from 'react-time-picker';
import { SketchPicker } from 'react-color';
import * as ROUTES from '../../constants/routes';
import { bigIntLiteral } from '@babel/types';
import './index.css';
import TextField from '@material-ui/core/TextField';
import EditCategoryForm from '../EditCategoryForm';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class AddPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
        subPosts: [{subPosts: null}]
    };
  }

 


  onSubmitForm = e => {
    e.preventDefault();

    // console.log(this.props.match.params.clientId);

    // const friendlyUrl = this.state.title.toLowerCase().replace(/ /g, '-');
    // const formMonth = this.state.calendarMonth;
    // const clientId = this.props.match.params.clientId;
    // this.props.firebase.addPost(
    //   clientId,
    //   this.state.title,
    //   this.state.copy,
    //   this.state.hashtags,
    //   this.state.time,
    //   parseInt(this.props.match.params.day),
    //   parseInt(this.props.match.params.month),
    //   this.state.values,
    //   this.state.metaImageFiles,
    //   friendlyUrl,
    //   false,
    //   this.state.selectedCategory
    // );

    // this.props.history.push(
    //   `/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`
    // );
  };

//   // File upload methods

//   addFile = event => {
//     const file = Array.from(event.target.files);

//     if (file.length === 1) {
//       this.setState({
//         file: [...this.state.file],
//         file
//       });
//     } else if (file.length > 1) {
//       const emptyFileArr = [];
//       file.map(innerFile => {
//         emptyFileArr.push(innerFile);
//       });

//       this.setState({
//         file: emptyFileArr
//       }, () => {
//         this.uploadFiles();
//         alert('uploaded')
//         console.log('statefile', this.state.file)
//       });
//     }
//   };

//   showState = e => {
//     e.preventDefault();
//     console.log(this.state);
//   };

//   monthNumToName = monthnum => {
//     var months = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December'
//     ];

//     return months[monthnum - 1] || '';
//   };

createForms() {
    return this.state.values.map((el, i) => (
        <div></div>
    ))
  }

  render() {


    return (
      <React.Fragment>
        <div className="add-post">
          <p className="heading text-center add-post-heading">
            Client {this.props.match.params.clientId} Calendar
            <br />
          </p>
          <div className="grey-background">
            <div className="container">
              <form onSubmit={this.onSubmitForm}>
                {this.createForms()}
                <div>Add Form</div>
                <div className="text-center">
                  <input type="submit" value="Submit" className="add-date-btn" />
                </div>
              </form>
            </div>
          </div>
          <EditCategoryForm
            clientId={this.props.match.params.clientId}
            getSelectedCategory={this.getSelectedCategory}
            category={this.state.selectedCategory}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(AddPost));
