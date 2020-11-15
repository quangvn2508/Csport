import React from 'react';
import marked from 'marked';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Selection from './Selection';

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

    changeLanguage = (value) => {this.setState({language: value});}
    updateFile = (event) => {this.setState({code: event.target.files[0]});}
    submitCode = (event) => {
        event.preventDefault();
        console.log(this.state.language);
        console.log(this.state.code);
        // TODO: Submit code to evaluate
    }

    render() {
        return (
            <Container>
                <h1>{this.state.title}</h1>
                <article dangerouslySetInnerHTML={{__html: this.state.statement}}></article>
                <Form onSubmit={this.submitCode}>
                    <Row>
                        <Col xs={2}>
                            <Selection title="Language" update={this.changeLanguage} selection={[{value: "py", label: "Python3"}, {value: "cpp", label: "C++14"}]} />
                        </Col>
                        
                        <Col xs={4}>
                            <input type="file" accept=".cpp,.py" onChange={this.updateFile}/>
                        </Col>
                        
                        <Col xs={2}>
                            <Button type="submit" variant="secondary" size="sm">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}
export default Problem;