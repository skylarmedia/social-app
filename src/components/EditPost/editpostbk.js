import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from "redux";
import { connect } from 'react-redux';
import TimePicker from 'react-time-picker';
import EditCategoryForm from '../EditCategoryForm';
import * as ROUTES from '../../constants/routes';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import './index.css';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: null,
            postTitle: '',
            postCopy: '',
            postHashtags: [],
            postTime: '',
            values: [],
            firestorageRef: this.props.firebase.storage,
            metaImageFiles: [],
            categories: [],
            selectedCategory: 'No Category|||#fff',
            currentHashtag: ''
        }

        this.handlePostTitle = this.handlePostTitle.bind(this);
        this.editPostSubmit = this.editPostSubmit.bind(this);
        this.getSelectedCategory = this.getSelectedCategory.bind(this);
        this.deleteHash = this.deleteHash.bind(this);
        // this.addHashtag = this.addHashtag.bind(this)
        // this.handleHashtags = this.handleHashtags.bind(this);
    }


    // componentWillMount() {
    //     this.props.firebase.editPostFirebase(this.props.match.params.clientId, this.props.match.params.postId).then(item => {
    //         this.setState({
    //             postTitle: item.data().title,
    //             postCopy: item.data().copy,
    //             postHashtags: item.data().hashtags,
    //             postTime: item.data().time,
    //             values: item.data().links,
    //             metaImageFiles: item.data().metaImageFiles,
    //             selectedCategory: item.data().selectedCategory,


    //         })
    //     });
    // }


    // handleChange(i, event) {
    //     let values = [...this.state.values];
    //     values[i] = event.target.value;
    //     this.setState({ values });
    // }

    // getType = (url) => {
    //     if (url !== 'No Files') {
    //         var checkUrl = new URL(url)

    //         var query_string = checkUrl.search;

    //         var search_params = new URLSearchParams(query_string);

    //         var type = search_params.get('type');

    //         return type
    //     }

    // }


    // createUI() {
    //     return this.state.values.map((el, i) =>
    //         <div key={i}>
    //             <input type="text" value={el || ''} onChange={this.handleChange.bind(this, i)} />
    //             <input type='button' value='x' onClick={this.removeClick.bind(this, i)} className="remove-hash" />
    //         </div>
    //     )
    // }

    // removeClick(i) {
    //     let values = [...this.state.values];
    //     values.splice(i, 1);
    //     this.setState({ values });
    // }


    // handlePostTitle = (e) => {
    //     this.setState({
    //         postTitle: e.target.value
    //     })
    // }

    // handlePostCopy = (e) => {
    //     this.setState({
    //         postCopy: e.target.value
    //     })
    // }

    // editPostSubmit = (event) => {
    //     event.preventDefault();

    //     this.props.firebase.editPostSubmit(
    //         this.props.match.params.clientId,
    //         this.props.match.params.postId,
    //         this.state.postTitle,
    //         this.state.postCopy,
    //         this.state.postHashtags,
    //         this.state.postTime,
    //         this.state.values,
    //         this.state.selectedCategory
    //     )

    //     this.props.history.push(`/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`);
    // }


    // deletePost = () => {
    //     if (window.confirm('Are you sure you wish to delete this item?')) {
    //         this.props.firebase.deletePost(this.props.match.params.clientId, this.props.match.params.postId)
    //         this.props.history.push(`/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`);
    //     }
    //     return false
    // }

    // getSelectedCategory = (event) => {
    //     this.setState({
    //         selectedCategory: event.target.value
    //     })
    // }

    // monthNumToName = (monthnum) => {
    //     var months = [
    //         'January', 'February', 'March', 'April', 'May',
    //         'June', 'July', 'August', 'September',
    //         'October', 'November', 'December'
    //     ];

    //     return months[monthnum - 1] || '';
    // }

    // onChangeTime = e => {
    //     this.setState({
    //         postTime: e
    //     })
    // }

    // deleteHash = (index) => {

    //     // console.log(this.getAttribute('index'), 'attributed')
    //     this.setState({
    //         postHashtags: this.state.postHashtags.filter((_, i) => i !== index)
    //     });
    // }

    // addNewHashtag = (e) => {
    //     e.preventDefault();

    //     this.setState({
    //         postHashtags: [...this.state.postHashtags, this.state.currentHashtag],
    //         currentHashtag: ''
    //     })

    // }

    // currentHashtagHandle = e => {
    //     this.setState({
    //         currentHashtag: e.target.value
    //     })
    // }


    render() {
        const media = this.state.metaImageFiles.map((item) => {
            if (this.getType(item) == 'video') {
                return (
                    <video height="200" width="200" controls>
                        <source src={item} />
                    </video>
                )
            } else if (this.getType(item) == 'image') {
                return (
                    <img src={item} />
                )
            } else {
                return (
                    <div>Sorry There is no media</div>
                )
            }
        })

        console.log(this.state.selectedCategory, 'selected category')



        const hashtags = this.state.postHashtags.map((hashtag, index) => (
            <div>{hashtag}<input type="button" onClick={() => this.deleteHash(index)} value="x" index={index} className="remove-hash" /></div>
        ));
        return (
            <div className="container add-post edit-post">
                <button onClick={this.deletePost} className="delete-post-button">
                    <Fab disabled aria-label="Delete">
                        <DeleteIcon />
                    </Fab>
                </button>
                <p className="heading text-center add-post-heading">Client {this.props.match.params.clientId} Calendar<br />{this.monthNumToName(parseInt(this.props.match.params.month))} {this.props.match.params.year} - Edit Post</p>
                <form onSubmit={this.editPostSubmit}>
                    <div className="d-flex align-items-end justify-content-between">
                        <div className="d-flex flex-wrap justify-content-between">
                            <TextField
                                margin="normal"
                                variant="outlined"
                                label="Title"
                                name="title"
                                value={this.state.postTitle}
                                onChange={this.handlePostTitle}
                                className="outlined-title" />
                            <TimePicker
                                onChange={this.onChangeTime}
                                value={this.state.postTime}
                            />
                            <TextField
                                id="outlined-multiline-static"
                                label="Copy"
                                className="outlined-copy"
                                multiline
                                rows="4"
                                defaultValue="Default Value"
                                margin="normal"
                                variant="outlined"
                                onChange={this.handlePostCopy} value={this.state.postCopy}
                            />
                            <br />
                            <div>
                                <p className="heading">Hashtags:</p>
                                {hashtags}

                                <p className="heading">Links:</p>
                                {this.state.values && (
                                    this.createUI()
                                )
                                }
                            </div>
                        </div>
                        <div>{media}</div>
                    </div>
                    <div className="text-center">
                        <input type="submit" value="Submit Edits" className="add-date-btn" />
                    </div>
                </form>

                <form onSubmit={this.addNewHashtag.bind(this)} >
                    <input name="hashtags" value={this.state.currentHashtag} onChange={this.currentHashtagHandle} placeholder="Add Hashtag" /><br />
                </form>

                <EditCategoryForm clientId={this.props.match.params.clientId} getSelectedCategory={this.getSelectedCategory} category={this.state.selectedCategory} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getPost: post => dispatch({
        type: 'GET_POST', post
    })
})

const mapStateToProps = state => (
    console.log(state, 'state in map state to props'), {
        post: state.setEditPostReducer
    })

export default compose(
    withFirebase,
    connect(
        null,
        mapDispatchToProps
    ))
    (EditPost)
