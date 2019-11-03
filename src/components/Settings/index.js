import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import MainButton  from '../MainButton';

class Settings extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            clients: [],
            showDelete: false,
            deleteClient:'',
            deleteIndex: null
        }

        this.reactivateClient = this.reactivateClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.confirmArchive = this.confirmArchive.bind(this);
    }

    componentWillMount(){
        this.props.firebase.getArchivedClients().then(snapshot => {
            let archivedClients = [...this.state.clients];
            snapshot.docs.map(item => {
                archivedClients.push(item.data())
            });
            this.setState({
                clients:archivedClients
            });
        })
    }

    confirmArchive = (e) => {
        if(e.target.value == 'true'){
        this.props.firebase.deleteClient(this.state.deleteClient);
        this.setState({ 
            clients: this.state.clients.filter((_, i) => i !== this.state.deleteIndex)
        });
        }
        this.setState({
          showDelete:!this.state.showDelete
        })
      }

    reactivateClient = (id, index) => {
        alert('ran')
        this.props.firebase.reactivateClient(id)
        this.setState({ 
            clients: this.state.clients.filter((_, i) => i !== index )
        });
    }

    deleteClient = (id, index) => {
        this.setState({
            showDelete: !this.state.showDelete,
            deleteClient: id,
            deleteIndex: index
        })
        // this.props.firebase.deleteClient(id);
        // this.setState({ 
        //     clients: this.state.clients.filter((_, i) => i !== index )
        // });
    }

    render(){
        return(
            <div>Settings
                <div class="row container mx-auto">
                {this.state.clients.map((item, index) => {
                    return (
                        <div class="col-sm-3">
                            <button onClick={() => this.deleteClient(item.name, index)} className="clear-btn top-delete">Delete</button>
                            <img src={item.logo}/>
                            <p class="text-center">{item.name}</p>
                            <button onClick={() => this.reactivateClient(item.name, index)} className="clear-btn text-center color-blue w-100">Reactivate Client</button>
                        </div>
                    )       
                })}
                </div>
                {this.state.showDelete && (
                    <div className="delete-btn">
                    <MainButton title="Delete Client?" subtitle="Are you sure you would like to delete this client? This action is permanent and cannot be un-done." buttonText="Delete" confirmArchive={this.confirmArchive.bind(this)} index='lanto' />
                    </div>
                )}
                
            </div>
        )
    }
}

export default compose(
    withFirebase(Settings)
)