import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import './index.css';
import DatePicker from 'react-datepicker';
import CustomCalendarComponent from '../CustomCalendarComponent';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Row, Col } from 'antd';
import ImagePosts from '../ImagePosts';
import app from 'firebase/app';

class ListMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: [],
      innerPosts: [],
      mainArr: [],
      approvedList: []
    };
    this.approvedPosts = this.approvedPosts.bind(this);
    this.unApprovedPosts = this.unApprovedPosts.bind(this);
    this.allPosts = this.allPosts.bind(this);
    this.db = app.firestore();
  }

  changeApp(id, index) {
    const listItems = [...this.state.listItems];
    listItems[index].approved = !listItems[index].approved;
    this.setState({
      listItems
    });

    this.db
      .collection('users')
      .doc(this.props.user)
      .collection('posts')
      .doc(id)
      .update({
        approved: listItems[index].approved
      });
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
          return item.post.map(inner => {
            return this.setState({
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
        return this.state.listItems.map(item => {
          return item.post.map(inner => {
            return this.setState({
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
          return item.post.map(inner => {
            return this.setState({
              innerPosts: [...this.state.innerPosts, inner]
            });
          });
        });
      }
    );
  }

  componentDidMount() {
    this.props.firebase
      .listMode(this.props.user, parseInt(this.props.month), parseInt(this.props.year))
      .then(snapshot => {
        snapshot.docs.map(item => {
          let postItem = {};
          postItem['post'] = item.data().post;
          postItem['id'] = item.id;
          postItem['approved'] = item.data().approved;
          postItem['color'] = item.data().color;
          postItem['name'] = item.data().selectedCategoryName;
          return this.setState(
            {
              mainArr: [...this.state.mainArr, postItem],
              listItems: [...this.state.listItems, postItem]
            },
            () => {
              this.state.listItems.map(item => {
                return item.post.map(inner => {
                  return this.setState({
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
        <div class="outter-inner-post-wrapper position-relative">
          <div className="inner-post-wrapper position-relative" key={index}>
            <div className="container">
              <div className="d-flex mb-20 justify-content-between col-sm-6 float-right margin-app">
                <div
                  className="align-items-center d-flex col-sm-6"
                  style={{
                    backgroundColor: item.color,
                    height: '36px'
                  }}
                >
                  {item.name}
                </div>
                <div className="align-self-center p-blue">
                  <Checkbox
                    checked={item.approved}
                    onChange={() => this.changeApp(item.id, index)}
                    id={`app-check-${index}`}
                  />
                  <label htmlFor={`app-check-${index}`} className="pl-15 d-inline-block">
                    APPROVE POST
                  </label>
                </div>
              </div>
            </div>
            {item.post.map((innerItem, indexInner) => {
              return (
                <React.Fragment key="indexInner">
                  <div className="time-outter-wrapper">
                    <div key={indexInner} className="inner-post">
                      <div className="inner-inner-post">
                        {indexInner === 0 && (
                          <div className="w-100">
                            <div className="border-20"></div>
                            <div className="container mx-auto time-wrapper">
                              <h5 className="time-string d-inline-block">
                                {this.convertTimeString(innerItem.ipDate)}
                              </h5>
                            </div>
                          </div>
                        )}
                        <Row gutter={30} className="container mx-auto inner-row">
                          <Col span={12} className="col22">
                            <p
                              className="w-100 blue-border f-16 color-blue pl-post p-15"
                              margin="normal"
                            >
                              {innerItem.title}
                            </p>
                            <div className="d-flex flex-wrap inner-images-wrapper mx-auto">
                              {innerItem.images.length > 0 ? (
                                <ImagePosts imageSrc={innerItem.images} />
                              ) : (
                                <div className="red-main-outter flex-wrap d-flex">
                                  <div id="red-outline-wrapper" className="w-100"></div>
                                  <div className="small-red-wrapper mb-20"></div>
                                  <div className="small-red-wrapper mb-20"></div>
                                  <div className="small-red-wrapper mb-20"></div>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="w-100 blue-border f-16 color-blue pl-post p-15">
                                POST COPY
                              </p>
                              <p>
                                {innerItem.copy ? innerItem.copy : 'No Copy Available'}
                              </p>
                            </div>
                          </Col>
                          <Col span={12} className="col333">
                            {indexInner === 0 && (
                              <div className="w-100 align-self-start platform-wrapper">
                                <Link
                                  to={`/edit-post/${item.id}/${this.props.user}`}
                                  className="go-post p-blue"
                                >
                                  <u>Go to post</u>
                                </Link>
                              </div>
                            )}

                            <div>
                              <p className="col-md-12 list-header align-self-center mb-5">
                                PLATFORMS
                              </p>
                              <div className="d-flex">
                                {innerItem.facebook ? (
                                  <div className="col-md-2 d-flex">
                                    <label>Facebook</label>{' '}
                                  </div>
                                ) : (
                                  <div className="mb-20"></div>
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
                                  <div className="col-sm-4 post-col">
                                    <DatePicker
                                      customInput={
                                        <CustomCalendarComponent
                                          ipDate={innerItem.ipDate}
                                          placeholderText="Post Date"
                                        />
                                      }
                                    />
                                  </div>
                                  <div className="col-sm-4">
                                    {this.convertMoment(innerItem.postTime)}
                                    <TimePicker
                                      className="date-col"
                                      placeholder="Sorry there was no date available"
                                      defaultValue={moment(innerItem.postTime, 'HH:mm')}
                                    />
                                  </div>
                                  <div className="col-sm-4">
                                    {/* <input type="text" value={innerItem.postMedium} className="clear-btn" /> */}
                                  </div>
                                </div>
                              </div>
                              <div className="w-100">
                                {innerItem.ad && (
                                  <div>
                                    <p className="col-md-12 list-header align-self-center test1">
                                      AD OR SPONSORED POST
                                    </p>

                                    {innerItem.ad && (
                                      <div className="col-md-12 row">
                                        <DatePicker
                                          customInput={
                                            <CustomCalendarComponent
                                              ipDate={innerItem.budgetStart}
                                            />
                                          }
                                        />
                                        <span>-</span>
                                        <DatePicker
                                          customInput={
                                            <CustomCalendarComponent ipDate={innerItem.budgetEnd} />
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="col-md-12 list-header align-self-center test2">
                                HashTags
                              </p>
                              <div className="col-sm-12">
                                <p>{innerItem.postHashTag}</p>
                              </div>
                              <p className="col-md-12 list-header align-self-center test3">Links</p>
                              <div className="col-sm-12">
                                {innerItem.values.map((link, index) => (
                                  <div key={index}>
                                    <a href={`http://wwww.${link.value}`} className="grey-link">
                                      {link.value}
                                    </a>
                                    <br />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    });
    return (
      <div className="position-relative">
        <div id="button-switch" className="text-right container mx-auto row f-16">
          <button onClick={this.allPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">All POSTS</u>
          </button>
          <button onClick={this.approvedPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">APPROVED POSTS</u>
          </button>
          <button onClick={this.unApprovedPosts.bind(this)} className="clear-btn p-blue>">
            <u className="p-blue">UNAPPROVED POSTS</u>
          </button>
        </div>
        <div id="render-parent">{renderParent.length > 0 ? renderParent : <div className="text-center"><strong>There are no posts.</strong></div>}</div>
      </div>
    );
  }
}

export default withFirebase(ListMode)
