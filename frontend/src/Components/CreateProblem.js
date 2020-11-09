import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class ProblemStatement extends React.Component {
    state = {
        title: '',
        statement: ''
    }

    editorOptions = {toolbar: [
        "bold", "italic", "strikethrough", "|",
        "heading-1", "heading-2", "heading-3", "|",
        "code", "quote", "unordered-list", "ordered-list", "horizontal-rule", "table", "|",
        "link",
        // {
        //     name: "custom-image",
        //     action: ,
        //     className: "fa fa-picture-o",
        //     title: "Insert image",
        // },
         "|",
        "preview"
    ]};

    
    validateForm = (event) => {return true};
    updateTitle = (event) => {this.setState({title: event.target.value});};
    updateStatement = (value) => {this.setState({statement: value});};

    submitNewProblem = (event) => {
        event.preventDefault();

        console.log("title: " + this.state.title + "\nstatement: " + this.state.statement);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submitNewProblem}>
                    <input type="text" value={this.state.title} onChange={this.updateTitle}/>
                    <input type="hidden" value={this.state.statement}/>
                    <div>
                        <SimpleMDE onChange={this.updateStatement} options={this.editorOptions}/>
                    </div>
                    <input type="submit" disabled={!this.validateForm()}/>
                </form>
            </div>
        )
    }
}

class ProblemTestcase extends React.Component {
    render() {
        return (
            <div>Test case tab</div>
        );
    }
}

class CreateProblem extends React.Component {
    state = {
        key: "statement"
    }

    render() {
        return (
            <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={(k) => this.setState({key: k})}>
                <Tab eventKey="statement" title="Problem Statement">
                    <ProblemStatement/>
                </Tab>
                <Tab eventKey="testcase" title="Testcase">
                    <ProblemTestcase/>
                </Tab>
            </Tabs>
        );
    }
}

export default CreateProblem;