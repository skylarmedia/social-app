import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

class EditCategoryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: []
        }

    }

    componentWillMount() {
        this.props.firebase.getUserCategories(this.props.clientId).then(items => {

            const editCatArr = []
            items.docs.map(item => {
                console.log(item.data(), 'item in map')
                let currentCat = {}
                currentCat.color = item.data().categories.color;
                currentCat.name = item.data().categories.name
                editCatArr.push(currentCat);
            })
            this.setState({
                categories: editCatArr
            })
        });
    }

    handleText = (string) => {
        if (string !== undefined) {
            return string.split('|||')[0]
        }
    }


    render() {
        const options = this.state.categories.map(item => {
            // console.log(item, 'item in category ')
            if (this.handleText(this.props.category) == item.name) {
                return (
                    <option value={`${item.name}|||${item.color}`} selected>{item.name}</option>
                )
            } else {
                return (
                    <option value={`${item.name}|||${item.color}`}>{item.name}</option>
                )
            }
        })

        return (
            <React.Fragment>
                <form>
                    <select name="options" onChange={this.props.getSelectedCategory}>
                        <option value={`No Category ||| #fff`} selected>No Category</option>
                        {options}
                    </select>
                </form>

            </React.Fragment >
        )
    }
}

export default compose(
    withFirebase(EditCategoryForm)
);