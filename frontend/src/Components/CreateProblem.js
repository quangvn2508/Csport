import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

class CreateProblem extends React.Component {
    state = {
        title: '',
        statement: '',
        testFile: null
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

    
    validateForm = () => {return true};
    updateTitle = (event) => {this.setState({title: event.target.value});};
    updateStatement = (value) => {this.setState({statement: value});};
    updateTestCaseFile = (event) => {this.setState({testFile: event.target.files[0]});}

    submitNewProblem = (event) => {
        event.preventDefault();
        let data = {
            testcase: new FormData(),
            title: this.state.title,
            statement: this.state.title
        };

        data.testcase.append('file', this.state.testFile);

        console.log(data);
    }
    render() {
        return (
            <div className="container">
                <h1>Create Problem</h1>
                <form onSubmit={this.submitNewProblem}>
                    <h2>Problem's Statement</h2>
                    <input type="text" value={this.state.title} placeholder="Problem title" onChange={this.updateTitle}/>
                    <input type="hidden" value={this.state.statement}/>
                    <div>
                        <SimpleMDE onChange={this.updateStatement} options={this.editorOptions}/>
                    </div>
                    <h2>Problem's testcases</h2>
                    <input type="file" accept=".zip" onChange={this.updateTestCaseFile}/>
                    <input type="submit" disabled={!this.validateForm()}/>
                </form>
            </div>
        );
    }
}

export default CreateProblem;