import React from 'react';
import './Trees.css';

class Trees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayInput: false,
            inputTreeValue: '',
            treeList: [],
            newNameTree: '',
        };
    }

    render() {
        return (
            <div id="trees-container">
                <div id="page-name">My page</div>
                <div id="treeList" className="siimple-list">
                    {this.state.treeList.map(el => {
                        return (
                            <div className="treeListDiv siimple-list-item" key={el.id} onClick={() => { }}>
                                <input className="siimple-input siimple-input--fluid white hide" type="text" placeholder={el.name} onChange={(evt) => this.handleChangeNewNameTree(evt)}></input>
                                <div ref={el.id} className="siimple-btn siimple-btn--light siimple-btn--fluid" onClick={() => {this.displayTree(el.id)}}>{el.name}</div>
                                <div className="siimple-btn siimple-btn--primary siimple-btn--small" onClick={() => this.displayRenameInput(el.id)}>Rename</div>
                                <div className="siimple-btn siimple-btn--primary siimple-btn--small hide" onClick={() => this.renameTree(el.id)}>Send</div>
                                <div className="siimple-btn siimple-btn--error siimple-btn--small hide" onClick={() => this.cancelRename(el.id)}>Cancel</div>
                            </div>
                        )
                    })}

                </div>
                {this.state.displayInput ?
                    <div id="inputTreeContainer">
                        <input id="inputTree" className="siimple-input center" type="text" placeholder="Name of your tree" onChange={(evt) => this.handleChangeInputTree(evt)}></input>
                        <button className="siimple-btn siimple-btn--primary btn center" onClick={() => this.createTree()}>Send</button>
                    </div>
                    : <button className="siimple-btn siimple-btn--primary btn" onClick={() => this.displayInput()}>Create a tree</button>}
            </div>
        );
    }


    cancelRename(treeId) {
        this.refs[treeId].classList.remove("hide");
        console.log(this.refs[treeId].parentElement.children[0]);
        this.refs[treeId].parentElement.children[0].classList.add("hide");
        this.refs[treeId].parentElement.children[2].classList.remove("hide");
        this.refs[treeId].parentElement.children[3].classList.add("hide");
        this.refs[treeId].parentElement.children[4].classList.add("hide");
    }

    //call this function when the component is appearing
    componentWillMount() {
        this.retrievingTreesList();
    }



    createRef() {

    }

    //creating a tree in database
    createTree() {
        if (this.state.inputTreeValue !== '') {
            const tree = { name: this.state.inputTreeValue, user_id: this.props.userId };
            fetch(`http://localhost:9091/postTree`, {
                method: 'post',
                body: JSON.stringify(tree),
                headers: { "Content-Type": "application/json" }
            }).then(res => {
                //res is a RedeableStream so we need a reader
                let reader = res.body.getReader();
                return reader.read();
            }).then(resp => {
                console.log(resp);
                let string = new TextDecoder("utf-8").decode(resp.value);
                console.log(string);
                this.retrievingTreesList();
                this.setState({
                    displayInput: false
                })
            })
        }
    }

    //at click on delete, we delete the tree in the database
    /*deleteTree(treeId) {
        fetch(`http://localhost:9091/deleteTree/${treeId}`)
    }*/

    //display input for the name of the tree
    displayInput() {
        this.setState({
            displayInput: true
        })
    }

    displayTree(treeId) {
        this.props.parentCallback3(treeId);
    }

    //if clicked on rename, we display an input for the new name wished
    displayRenameInput(treeId) {
        console.log(this);
        console.log(treeId);
        console.log(this.refs[treeId]);
        this.refs[treeId].classList.add("hide");
        console.log(this.refs[treeId].parentElement.children[0]);
        this.refs[treeId].parentElement.children[0].classList.remove("hide");
        this.refs[treeId].parentElement.children[2].classList.add("hide");
        this.refs[treeId].parentElement.children[3].classList.remove("hide");
        this.refs[treeId].parentElement.children[4].classList.remove("hide");
        /*this.setState({
    treeListRename[treeId]: this.state.treeListRename[treeId]
})*/
        //console.log(this.state.treeListRename);
    }

    //store the value of what user typed
    handleChangeInputTree(evt) {
        this.setState({
            inputTreeValue: evt.target.value
        })
    }

    //store the value for a tree to rename
    handleChangeNewNameTree(evt) {
        console.log(this.state.newNameTree);
        this.setState({
            newNameTree: evt.target.value
        })
    }


    /*<div>
                        {this.state.treeList.map(el => {
                            return (
                                <div key={el.id}>{el.name}</div>
                            )
                        })}
                    )
                    </div>*/

    /*renameTree() {
        fetch(`http://localhost:9091/getTreeList/${this.}`)
    }*/

    //replace a name of a tree in the db
    renameTree(treeId) {
        if (this.state.newNameTree != '') {
            const tree = { id: treeId, name: this.state.newNameTree, user_id: this.props.userId };
            fetch(`http://localhost:9091/updateTree`, {
                method: 'put',
                body: JSON.stringify(tree),
                headers: { "Content-Type": "application/json" }
            }).then(res => {
                //res is a RedeableStream so we need a reader
                let reader = res.body.getReader();
                return reader.read();
            }).then(resp => {
                console.log(resp);
                let string = new TextDecoder("utf-8").decode(resp.value);
                console.log(string);
                this.retrievingTreesList();
                this.cancelRename(treeId);
            })
        }
    }

    //show the list of the trees to the user
    retrievingTreesList() {
        if (this.props.userId) {
            fetch(`http://localhost:9091/getTreeList/${this.props.userId}`, {
                method: 'get'
            })
                .then(res => {
                    return res.json();
                }).then(resp => {
                    this.setState({
                        treeList: resp
                    })
                    console.log(this.state.treeList);
                })
        } else {
            return;
        }
    }

    //array to manage tree renaming
    /*treeListRename() {
        let j=0;
        for (var i=0; i<this.state.treeList.length-1; i++) {
            console.log("i="+i)
            
            this.setState(prevState => ({
                treeListRename: [...prevState.treeListRename, false]
            }))
            console.log(`j=${j+1}`);
            console.log(this.state.treeList);
        }
        console.log("yo");
    }*/
}

export default Trees;