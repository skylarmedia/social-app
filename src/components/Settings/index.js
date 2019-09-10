import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

class Settings extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            clients: []
        }

        this.reactivateClient = this.reactivateClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
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

    reactivateClient = (id, index) => {
        alert('ran')
        this.props.firebase.reactivateClient(id)
        this.setState({ 
            clients: this.state.clients.filter((_, i) => i !== index )
        });
    }

    deleteClient = (id, index) => {
        alert('ran');
        this.props.firebase.deleteClient(id);
        this.setState({ 
            clients: this.state.clients.filter((_, i) => i !== index )
        });
    }

    render(){
        console.log('Firebase', this.props)
        console.log('Firebase reactive', this.props.firebase.reactivateClient);
        console.log('Firebase archive Clients', this.props.firebase.getArchivedClients);
        return(
            <div>Settings
                <div class="row container mx-auto">
                {this.state.clients.map((item, index) => {
                    console.log('item', item)
                    return (
                        <div class="col-sm-3">
                            <button onClick={() => this.deleteClient(item.name, index)}>Delete</button>
                            {item.userId}
                            <img src={item.logo}/>
                            <p class="text-center">{item.name}</p>
                            <button onClick={() => this.reactivateClient(item.name, index)}>Reactivate Client</button>
                        </div>
                    )       
                })}
                </div>
            </div>
        )
    }
}

export default compose(
    withFirebase(Settings)
)