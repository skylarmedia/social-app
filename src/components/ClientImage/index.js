import React, { Component } from 'react';
import app from 'firebase/app';

class ClientImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0
    };

    this.db = app.firestore();
    this.functions = app.functions();
  }

  // unsubscribe = () =>
  //   this.db
  //     .collection('chats')
  //     .doc(this.props.name)
  //     .collection('messages')
  //     .onSnapshot(snap => {
  //       snap.docChanges().forEach(change => {
  //         if (change.type == 'added') {
  //           let oldState = Object.assign({}, this.state.size);
  //           oldState.size = this.state.size;
  //           let addedState = oldState.size + 1;
  //           this.setState({
  //             size: addedState
  //           });
  //         }
  //       });
  //     });

  componentWillMount() {
    const updateHomeClientMessages = this.functions.httpsCallable('updateHomeClientMessages');
    let functionObj = new Object();
    functionObj.userId = this.props.name;
    updateHomeClientMessages(functionObj).then(res => {
      console.log('RES IN SIZE', res.data, this.props.name);
        this.setState({
          size: res.data._size
        });
    });

    // this.unsubscribe();
  }


  render() {
    const styles = {
      backgroundImage:`url(${this.props.logo}`,
      width: "100%",
      height: "178px",
      backgroundSize: "cover"
    }
    return (
      <div class="position-relative new-home-bg" style={styles}>
        <p className="size-int position-absolute bg-red f-16 d-inline-flex align-items-center justify-content-center">{this.state.size}</p>
      </div>
    );
  }
}

export default ClientImage;
