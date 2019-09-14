import React from 'react';
import Navbar from '../Navbar/Navbar'
import Login from '../Login/Login'
import Trees from '../Trees/Trees'
import Members from '../Members/Members'
import './Container.css';
import '../../node_modules/siimple'

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authStatus: 'true',
            userEmail: '',
            userId: '42',
            treeId: ''
        };
    }

    render() {
        return (
            <div id="container">
                <Navbar></Navbar>
                {this.state.authStatus === 'false' ? 
                <Login key='1' parentCallback = {this.checkAuthStatus} parentCallback2 = {this.retrieveUserEmail}></Login>
                :[this.state.treeId ?
                    <Members key='3' treeId={this.state.treeId}></Members> 
                    :<Trees key='2' parentCallback3 = {this.retrieveTreeId} userId = {this.state.userId}></Trees>]}
            </div>
        );
    }

    checkAuthStatus = (authStatusToBe) => {
        this.setState({
            authStatus: authStatusToBe
        });
    }
   
    retrieveTreeId = (treeId) => {
        this.setState({
            treeId: treeId
        });
        console.log(this.state.treeId);

    } 

    check() {
        console.log(this.state.treeId);

    }

    //we retrieve it from the child component login
    retrieveUserEmail = (userEmail) => {
        this.setState({
            userEmail: userEmail
        })
        console.log(this.state.userEmail);
        this.retrieveUserId(this.state.userEmail);
    }

    //we retrieve it from a request to database
    retrieveUserId = (userEmail) => {
        fetch(`http://localhost:9091/getUser/${userEmail}`, { 
            method: 'get'
        }).then(res => {
            console.log(res);
            //res is a RedeableStream so we need a reader
            let reader = res.body.getReader();
            return reader.read();
        }).then(resp => {
            console.log(resp);
            let user = new TextDecoder("utf-8").decode(resp.value);
            console.log(user);
            user = JSON.parse(user);
            console.log(user.id);
            this.setState({
                userId: user.id
            });
        })
    }

};

export default Container;