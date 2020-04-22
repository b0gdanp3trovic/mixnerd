import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav"
import './navigation.css'
import {withRouter} from "react-router-dom";

function Navigation(){
    return(
        <Navbar className={"navbar"} expand="lg">
            <div className={"navContainer"}>
                <Navbar.Brand className={"brand"} href="/">Mixnerd</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Recognizer</Nav.Link>
                    <Nav.Link href="/mm">Mixmaker</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    )
}

export default withRouter(Navigation)