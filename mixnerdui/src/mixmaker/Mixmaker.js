import React, {useState} from "react";
import Navigation from "../nav/navigation";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import './Mixmaker.css'
import axios from "axios";

export default function Mixmaker(){

    var image = require('../assets/man-face-with-headphones-sunglasses-and-beard.png');
    const [urlList, setUrlList] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [titleList, setTitleList] = useState([]);


    function addUrl(){
        if(currentUrl.length > 0){
            const params = {
                url :'http://www.youtube.com/oembed?url=' + currentUrl + '&format=json'
            };
            axios.post('http://127.0.0.1:5000/info', params).then(response => {
                const title = response.data.title;
                setTitleList([...titleList, title]);
                setUrlList([...urlList, currentUrl]);
                setCurrentUrl('');
            });

        }
    }

    function postUrls(){
        var saveAs = require('file-saver');
        const params = {
            urls: urlList
        }
        return axios.post('http://127.0.0.1:5000/mix', params, {responseType: "blob"}).then(response => {
            saveAs(response.data, 'output.mp3');
        })
    }
    return(
        <div>
            <Navigation/>
            <div className={"pageContainer"}>
                <Image src={image} className={"image"}/>
                <h1 className={"title"}>Mixnerd</h1>
                <div className={"formContainer"}>
                    <Form className={"mainForm"}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control placeholder="Paste Youtube mixtape link here"
                                          value = {currentUrl}
                                          onChange={e => setCurrentUrl(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Button  className={"button"} disabled={currentUrl.length === 0} onClick={addUrl}
                            variant="light">Add to mixtape</Button>{' '}
                    <Form.Group controlId="formBasicCheckbox">
                    </Form.Group>
                </div>
                <Button  className={"buttonMixtape"}  onClick={postUrls}
                         variant="outline-secondary">Make a mixtape</Button>{' '}
                <ListGroup>
                    {titleList.map((element, i)=> {
                        return(<ListGroup.Item key={i}>{element}</ListGroup.Item>)
                    })}
                </ListGroup>
            </div>
        </div>
    )
}