import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import './index.css';
import DatePicker from 'react-datepicker';
import CustomCalendarComponent from '../CustomCalendarComponent';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';

class ListMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: [],
      innerPosts: [],
      mainArr: []
    };
    this.approvedPosts = this.approvedPosts.bind(this);
    this.unApprovedPosts = this.unApprovedPosts.bind(this);
    this.allPosts = this.allPosts.bind(this);
  }

  approvedPosts() {
    const approved = this.state.mainArr.filter((item, index) => {
      return item.approved;
    });

    this.setState(
      {
        listItems: approved
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
  }

  allPosts = () => {
    this.setState(
        {
          listItems: this.state.mainArr
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
  }

  unApprovedPosts() {
    const notApproved = this.state.mainArr.filter((item, index) => {
      return item.approved === false
    });

    this.setState(
      {
        listItems: notApproved
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
  }

  componentWillMount() {
    this.props.firebase
      .listMode(this.props.user, parseInt(this.props.month), parseInt(this.props.year))
      .then(snapshot => {
        snapshot.docs.map(item => {
          this.setState(
            {
              mainArr: [...this.state.mainArr, item.data()],
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

  convertMoment = string => {
    moment(string, 'HH:mm a');
  };

  render() {
    const renderParent = this.state.listItems.map((item, index) => {
      console.log('ITEM', item);
      return (
        <div class="row">
          <div class="col-sm-6">
            {item.post.map(innerItem => {
              console.log('INNER ITEM', innerItem);
              return (
                <div>
                  <div>{this.convertTimeString(innerItem.ipDate)}</div>
                  <div>{innerItem.title}</div>
                  <div class="col-sm-6 inner-images-wrapper">
                    {innerItem.images.length > 0 ? (
                      innerItem.images.map(img => <img src={img} class="image-inner" />)
                    ) : (
                      <p>RED BOX</p>
                    )}
                  </div>
                  <div class="col-sm-6">
                    <input
                      className="outlined-copy"
                      label="Copy"
                      name="copy"
                      multiline
                      value={item.copy}
                      margin="normal"
                      variant="outlined"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div class="col-sm-6 row">
            <div class="col-sm-6">CATEGORY</div>
            <div class="col-sm-6">
              {item.approved == true ? (
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
            </div>
            {item.post.map(innerItem => {
              return (
                <div class="row col-sm-12">
                  <div>
                    <input type="checkbox" checked={innerItem.facebook ? 'checked' : ''} />
                    <label>Facebook</label>
                  </div>
                  <div>
                    <input type="checkbox" checked={innerItem.instagram ? 'checked' : ''} />
                    <label>Instagram</label>
                  </div>
                  <div>
                    <input type="checkbox" checked={innerItem.twitter ? 'checked' : ''} />
                    <label>Twitter</label>
                  </div>
                  <div>
                    <input type="checkbox" checked={innerItem.linkedin ? 'checked' : ''} />
                    <label>Linkedin</label>
                  </div>
                  <div>
                    <input type="checkbox" checked={innerItem.other ? 'checked' : ''} />
                    <label>Other</label>
                  </div>
                  <div class="row">
                    <div class="col-sm-4">
                      TEST
                      <DatePicker
                        customInput={
                          <CustomCalendarComponent
                            ipDate={innerItem.ipDate}
                            placeholderText="Post Date"
                          />
                        }
                      />
                    </div>
                    <div class="col-sm-4">
                      {this.convertMoment(innerItem.postTime)}
                      <TimePicker
                        placeholder="Sorry there was no date available"
                        defaultValue={moment(innerItem.postTime, 'HH:mm')}
                      />
                    </div>
                    <div class="col-sm-4">
                      <input type="text" value={innerItem.postMedium} />
                    </div>
                  </div>
                  <div class="col-sm-12">
                    {innerItem.ad ? (
                      <div>
                        <div class="d-flex">
                          <input type="checkbox" checked />
                          <label>Ad or Sponsored Post</label>
                        </div>
                        <div>
                          <DatePicker
                            customInput={<CustomCalendarComponent ipDate={innerItem.budgetStart} />}
                          />
                          <span>-</span>
                          <DatePicker
                            customInput={<CustomCalendarComponent ipDate={innerItem.budgetEnd} />}
                          />
                        </div>
                      </div>
                    ) : (
                      <div class="d-flex">
                        <input type="checkbox" />
                        <label>Ad or Sponsored Post</label>
                      </div>
                    )}
                  </div>
                  <div class="col-sm-12">
                    <input
                      className="outlined-copy"
                      label="hashtag"
                      name="hashtag"
                      value={innerItem.postHashTag}
                      margin="normal"
                      variant="outlined"
                    />
                  </div>
                  <div class="col-sm-12">
                    {innerItem.values.map(link => (
                      <div>
                        <a href={`${link.value}`}>{link.value}</a>
                        <br />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
    return (
      <div>
        <div id="button-switch">
        <button onClick={this.allPosts.bind(this)}>All POSTS</button>
          <button onClick={this.approvedPosts.bind(this)}>APPROVED POSTS</button>
          <button onClick={this.unApprovedPosts.bind(this)}>APPROVED POSTS</button>
        </div>
        <div>{renderParent}</div>
      </div>
    );
  }
}

export default compose(withFirebase)(ListMode);
