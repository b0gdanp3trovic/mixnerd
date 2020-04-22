import {Route, Switch} from "react-router-dom";
import React, {useContext, useState} from "react";
import Recognizer from "./recognizer/Recognizer";
import Mixmaker from "./mixmaker/Mixmaker";


export default function Routing(props){
    const [urlList, setUrlList] = useState([]);

    return(
        <div>
            <Switch>
                <Route exact path = '/' component={Recognizer} />
                <Route exact path = '/mm' component = {Mixmaker} />
            </Switch>
        </div>
    )
}