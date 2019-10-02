import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

class EditCategoryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            selectedCategory: ''
        }
    }

    currentCategory = (e) => {
        if(e.target.value !== undefined){
            let color = e.target.value.split('|||')[1];
            let name = e.target.value.split('|||')[0];
            
            this.props.getSelectedCategory(color, name)
        }
    }

    componentWillMount() {
        this.props.firebase.getUserCategories(this.props.clientId, parseInt(this.props.month)).then(items => {

            const editCatArr = []
            items.docs.map((item, index) => {
                console.log(item.data(), 'item in map')
                let currentCat = {}
                currentCat.color = item.data().color;
                currentCat.name = item.data().name
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
        console.log(this.state, 'FINAL STATE    ')
        const options = this.state.categories.map((item, index) => {
            // console.log(item, 'item in category ')
            if (this.handleText(this.props.category) == item.name) {
                return (
                    <option value={`${item.name}|||${item.color}`} selected key={index}>{item.name}</option>
                )
            } else {
                return (
                    <option value={`${item.name}|||${item.color}`} key={index}>{item.name}</option>
                )
            }
        })

        return (
            <React.Fragment>
                <form>
                    <select name="options" onChange={this.currentCategory.bind(this)}>
                    
                        {this.props.currentCat ? 
                            <option value={`${this.props.currentCat} ||| #fff`} selected>{this.props.currentCat}</option> : <option value={`No Category ||| #fff`} selected>No Category</option>
                        }
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