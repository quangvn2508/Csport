import React from 'react';
import marked from 'marked';

class Problem extends React.Component {
    state = {
        title: "Title",
        statement: "",
        problemId: this.props.match.params.problemId,
        language: "py",
        code: null
    }
    

    componentDidMount() {
        // TODO: Get Problem statement

        // Example for rendering markdown
        const text = "# Just a title of post with id " + this.state.problemId;
        this.setState({
            statement: marked(text)
        });
    }

    changeLanguage = (event) => {this.setState({language: event.target.value});}
    updateFile = (event) => {this.setState({code: event.target.files[0]});}
    submitCode = (event) => {
        event.preventDefault();
        console.log(this.state.language);
        console.log(this.state.code);
        // TODO: Submit code to evaluate
    }

    render() {
        return (
            <div>
                <h1>{this.state.title}</h1>
                <article dangerouslySetInnerHTML={{__html: this.state.statement}}></article>
                <form onSubmit={this.submitCode}>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option defaultChecked value="py">Python3</option>
                        <option value="cpp">C++14</option>
                    </select>
                    <input type="file" accept=".cpp,.py" onChange={this.updateFile}/>
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}
export default Problem;