import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import './index.css';
import DatePicker from 'react-datepicker';
import CustomCalendarComponent from '../CustomCalendarComponent';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { Checkbox } from 'antd';

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
  };

  unApprovedPosts() {
    const notApproved = this.state.mainArr.filter((item, index) => {
      return item.approved === false;
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
        <div className="row post-list-wrapper">
          <div className="col-sm-6">
            {item.post.map(innerItem => {
              return (
                <div>
                  <h5 class="time-string">{this.convertTimeString(innerItem.ipDate)}</h5>
                  <TextField
                    className="w-100 margin-border"
                    value={innerItem.title}
                    margin="normal"
                  />

                  <div className="col-sm-10 d-flex flex-wrap inner-images-wrapper mx-auto">
                    {innerItem.images.length > 0 ? (
                      innerItem.images.map(img => (
                        <div>
                          <img src={img} className="w-100 border-image" />
                        </div>
                      ))
                    ) : (
                      <p>RED BOX</p>
                    )}
                  </div>
                  <div class="col-md-12">
                    <TextField className="w-100 margin-border" value="POST COPY" margin="normal" />
                    <p>{innerItem.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div class="col-sm-6 row">
            <div class="col-sm-6 align-self-center">CATEGORY</div>
            <div class="col-sm-6 align-self-center">
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
                <div className="row col-sm-12 flex-wrap justify-content-between">
                  <p className="col-md-12 list-header align-self-center">PLATFORMS</p>
                  <div className="col-md-2 d-flex">
                    <Checkbox
                      name="facebook"
                      value={innerItem.facebook}
                      checked={innerItem.facebook ? 'checked' : ''}
                      id="facebook"
                    />
                    <label>Facebook</label>
                  </div>
                  <div className="col-md-2 d-flex">
                    <Checkbox
                      name="instagram"
                      value={innerItem.instagram}
                      checked={innerItem.instagram ? 'checked' : ''}
                      id="instagram"
                    />
                    <label>Instagram</label>
                  </div>
                  <div className="col-md-2 d-flex">
                    <Checkbox
                      name="instagram"
                      value={innerItem.twitter}
                      checked={innerItem.twitter ? 'checked' : ''}
                      id="instagram"
                    />
                    <label>Twitter</label>
                  </div>
                  <div className="col-md-2 d-flex">
                    <Checkbox
                      name="instagram"
                      value={innerItem.linkedin}
                      checked={innerItem.linkedin ? 'checked' : ''}
                      id="instagram"
                    />
                    <label>Linkedin</label>
                  </div>
                  <div className="col-md-2 d-flex">
                    <Checkbox
                      name="instagram"
                      value={innerItem.other}
                      checked={innerItem.other ? 'checked' : ''}
                      id="instagram"
                    />
                    <label>Other</label>
                  </div>
                  <div class="row">
                    <div className="row col-md-12 list-header">
                      <p className="col-sm-4 m-0 align-self-center">POST DATE</p>
                      <p className="col-sm-4 m-0 align-self-center">POST TIME</p>
                      <p className="col-sm-4 m-0 align-self-center">POST MEDIUM</p>
                    </div>
                    <div className="row col-md-12 ">
                      <div class="col-sm-4">
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
                  </div>
                  <div class="col-sm-12">
                    {innerItem.ad ? (
                      <div>
                        <div class="d-flex">
                          <Checkbox checkbox id="facebook" />
                          />
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
      <div class="position-relative">
        <div id="button-switch position-absolute" class="text-right">
          <button onClick={this.allPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">All POSTS</u>
          </button>
          <button onClick={this.approvedPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">APPROVED POSTS</u>
          </button>
          <button onClick={this.unApprovedPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">APPROVED POSTS</u>
          </button>
        </div>
        <div>{renderParent}</div>
      </div>
    );
  }
}

export default compose(withFirebase)(ListMode);
