import React from 'react';
import './Members.css';

class Members extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersList: [],
            membersListIndexed: [],
            relationshipList: [],
            activate: false
        };
    }

    render() {
        return (
            <div id="members-container">
                {this.state.relationshipList.map(el => {
                    return (
                        <div key={el.id}>
                            {el.member1_id}
                            {this.state.activate ? this.state.membersListIndexed[el.member1_id].firstname:"false" }
                            {el.member2_id}
                        </div>
                    )
                })}
            </div>
        );
    }

    //{this.state.membersListIndexed[78].id ? "true" : "false"}

    //{this.state.membersListIndexed[78] ? <div>{this.state.membersListIndexed[78]}</div>:<div>"no"</div> }
    //call this function when the component is appearing
    componentWillMount() {
        this.retrievingRelationshipList();
        this.retrievingMembersList();
        console.log(this.state.membersListIndexed[78]);
    }

    componentDidMount() {
        console.log(this.state.membersListIndexed);
    }

    //create list to manipulate easier 
    indexMemberList() {
        this.state.membersList.forEach(el => {
            this.state.membersListIndexed[el.id]=el;
        });
        console.log(this.state.membersListIndexed);
        this.setState({
            activate: true
        })
    }

    retrievingRelationshipList() {
        fetch(`http://localhost:9091//getRelationshipListByTreeId/${this.props.treeId}`, {
            method: 'get'
        }).then(res => {
            return res.json();
        }).then(resp => {
            this.setState({
                relationshipList: resp
            });
            console.log(this.state.relationshipList)
        })
    }

    retrievingMembersList() {
        fetch(`http://localhost:9091/getMemberList/${this.props.treeId}`, {
            method: 'get'
        }).then(res => {
            return res.json();
        }).then(resp => {
            console.log(resp);
            this.setState({
                membersList: resp
            });
            this.indexMemberList();
        })
    }
}

export default Members;