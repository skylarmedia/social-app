import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import './index.css';
import DatePicker from 'react-datepicker';
import CustomCalendarComponent from '../CustomCalendarComponent';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
import { Link } from 'react-router-dom';
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
          let postItem = {}
          postItem['post'] = item.data().post
          postItem['id'] = item.id
          this.setState(
            {
              mainArr: [...this.state.mainArr, postItem],
              listItems: [...this.state.listItems, postItem]
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
                  <div class="w-100">
                    <TextField className="w-100 margin-border" value="POST COPY" margin="normal" />
                    <p>{innerItem.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-sm-6 align-self-start">
            <Link to={`/edit-post/${this.props.user}/${item.id}`}>Go to post</Link>
            <div className="d-flex">
              <div class="col-sm-6 align-self-center">CATEGORY</div>
              <div class="col-sm-6 align-self-center">
                {item.approved == true ? (
                  <div>
                    <Checkbox checked />
                    Approved
                  </div>
                ) : (
                  <div>
                    <input type="checkbox" />
                    Not approved
                  </div>
                )}
              </div>
            </div>
            {item.post.map(innerItem => {
              return (
                <div className="justify-content-between">
                  <p className="col-md-12 list-header align-self-center">PLATFORMS</p>
                  <div className="d-flex">
                    {innerItem.facebook ? (
                      <div className="col-md-2 d-flex">
                        <label>Facebook</label>{' '}
                      </div>
                    ) : (
                      ''
                    )}

                    {innerItem.instagram ? (
                      <div className="col-md-2 d-flex">
                        <label>Instagram</label>
                      </div>
                    ) : (
                      ''
                    )}

                    {innerItem.twitter ? (
                      <div className="col-md-2 d-flex">
                        <label>Twitter</label>{' '}
                      </div>
                    ) : (
                      ''
                    )}

                    {innerItem.linkedin ? (
                      <div className="col-md-2 d-flex">
                        <label>LinkedIn</label>{' '}
                      </div>
                    ) : (
                      ''
                    )}

                    {innerItem.other ? (
                      <div className="col-md-2 d-flex">
                        <label>Other</label>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <div className="d-flex list-header align-self-center">
                      <p className="col-sm-4 m-0 align-self-center">POST DATE</p>
                      <p className="col-sm-4 m-0 align-self-center">POST TIME</p>
                      <p className="col-sm-4 m-0 align-self-center">POST MEDIUM</p>
                    </div>
                    <div className="row col-md-12 ">
                      <div class="col-sm-4 post-col">
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
                          className="date-col"
                          placeholder="Sorry there was no date available"
                          defaultValue={moment(innerItem.postTime, 'HH:mm')}
                        />
                      </div>
                      <div class="col-sm-4">
                        <input type="text" value={innerItem.postMedium} class="clear-btn" />
                      </div>
                    </div>
                  </div>
                  <div className="w-100">
                          
                    {innerItem.ad ? (
                      <div>
                      <p className="col-md-12 list-header align-self-center">AD OR SPONSORED POST</p>
                        {/* <div class="d-flex">
                          <Checkbox checkbox={innerItem ? true : false} id="checked" />

                          <label>Ad or Sponsored Post</label>
                        </div> */}

                        {innerItem.ad && (
                          <div className="col-md-12">
                            <DatePicker
                              customInput={
                                <CustomCalendarComponent ipDate={innerItem.budgetStart} />
                              }
                            />
                            <span>-</span>
                            <DatePicker
                              customInput={<CustomCalendarComponent ipDate={innerItem.budgetEnd} />}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div class="d-flex">
                        <input type="checkbox" />
                        <label>Ad or Sponsored Post</label>
                      </div>
                    )}
                  </div>
                  <p className="col-md-12 list-header align-self-center">HashTags</p>
                  <div class="col-sm-12">
                    <p>{innerItem.postHashTag}</p>
                  </div>
                  <p className="col-md-12 list-header align-self-center">Links</p>
                  <div class="col-sm-12">
                    {innerItem.values.map(link => (
                      <div>
                        <a href={`http://wwww.${link.value}`} class="grey-link">{link.value}</a>
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
