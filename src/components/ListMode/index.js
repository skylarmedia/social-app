import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import './index.css';
import DatePicker from 'react-datepicker';
import CustomCalendarComponent from '../CustomCalendarComponent';

class ListMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: [],
      innerPosts: []
    };
  }

  componentWillMount() {
    this.props.firebase
      .listMode(this.props.user, parseInt(this.props.month), parseInt(this.props.year))
      .then(snapshot => {
        snapshot.docs.map(item => {
          this.setState(
            {
              listItems: [...this.state.listItems, item.data()]
            },
            () => {
              this.state.listItems.map(item => {
                item.post.map(inner => {
                  this.setState({
                    innerPosts: [...this.state.innerPosts, inner]
                  });
                });
              });
            }
          );
        });
      });
  }

  convertTimeString(string) {
    var date = string.split('/');
    var f = new Date(date[2], date[0] - 1, date[1]);
    return f.toString();
  }

  render() {
    const renderParent = this.state.listItems.map((item, index) => (
      <li class="row">
        <div class="col-sm-6">
          {this.state.innerPosts.map((inner, index) => {
            return (
              <li>
                <div>
                  <div>{this.convertTimeString(inner.ipDate)}</div>
                  <div>{inner.title}</div>
                  <div class="inner-images-wrapper col-sm-12 row">
                    {inner.images.map(img => (
                      <img src={img} class="image-inner" />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
          <input
            className="outlined-copy"
            label="Copy"
            name="copy"
            multiline
            value={item.copy}
            margin="normal"
            variant="outlined"
            index={index}
          />
        </div>
        <div class="col-sm-6 row flex-wrap">
          <span class="col-sm-6">CAT</span>
          <span class="col-sm-6">
            {item.approved ? (
              <div>
                <input type="checkbox" checked />
                Approved
              </div>
            ) : (
              <div>
                <input type="checkbox" />
                Not approved
              </div>
            )}
          </span>

          <div class="col-sm-12">
            <input type="checkbox" />
            {this.state.listItems[index].post.map((inner, index) => {
              console.log('inner', inner);
              return (
                <div>
                  <div class="row">
                    <div>
                      <input type="checkbox" checked={inner.facebook ? 'checked' : ''} />
                      <label>Facebook</label>
                    </div>
                    <div>
                      <input type="checkbox" checked={inner.instagram ? 'checked' : ''} />
                      <label>Instagram</label>
                    </div>
                    <div>
                      <input type="checkbox" checked={inner.twitter ? 'checked' : ''} />
                      <label>Twitter</label>
                    </div>
                    <div>
                      <input type="checkbox" checked={inner.linkedin ? 'checked' : ''} />
                      <label>Linkedin</label>
                    </div>
                    <div>
                      <input type="checkbox" checked={inner.other ? 'checked' : ''} />
                      <label>Other</label>
                    </div>
                  </div>
                  <DatePicker
                    customInput={
                      <CustomCalendarComponent ipDate={inner.ipDate} placeholderText="Post Date" />
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </li>
    ));

    return (
      <div>
        <ul>{renderParent}</ul>
      </div>
    );
  }
}

export default compose(withFirebase)(ListMode);
