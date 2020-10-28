import React, {useEffect, useRef, useState} from "react";
import Navigation from "../nav/navigation";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import './Mixmaker.css'
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import { animateScroll } from "react-scroll";
import { v4 } from 'uuid';


const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

export default function Mixmaker(){
    const clear = require('../assets/clear.png')
    var image = require('../assets/man-face-with-headphones-sunglasses-and-beard.png');
    const [urlList, setUrlList] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [titleList, setTitleList] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [urlAddErr, setUrlAddErr] = useState(false);

    const scrollRef = useRef(null);


    function addUrl(){
        if(currentUrl.length > 0){
            const params = {
                url :'http://www.youtube.com/oembed?url=' + currentUrl + '&format=json'
            };
            axios.post('/info', params).then(response => {
                const title = response.data.title;
                setTitleList([...titleList, title]);
                setUrlList([...urlList, currentUrl]);
                setCurrentUrl('');
                setUrlAddErr(false);
            }).catch(error => {
                setUrlAddErr(true);
            });

        }
    }

    function postUrls(){
        setDataLoading(true);
        var saveAs = require('file-saver');
        const params = {
            urls: urlList
        };
        return axios.post('http://127.0.0.1:5000/mix', params, {responseType: "blob"}).then(response => {
            saveAs(response.data, 'output.mp3');
            setDataLoading(false);
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
                {urlList.length > 0 && titleList.length > 0 && !dataLoading && <Button  className={"buttonMixtape"}  onClick={postUrls}
                         variant="outline-secondary">Mix and download</Button>}
                {urlAddErr && <Toast className={"toastInvalid"}>
                    <Toast.Body>Error loading url.</Toast.Body>
                </Toast>}
                {!dataLoading && <ListGroup>
                    {titleList.map((element, i)=> {
                        return(<div key={v4()} className={"listContainer"}><ListGroup.Item ref={scrollRef}>{element}</ListGroup.Item>
                            <button onClick={() => {
                                const nTitleList = [...titleList];
                                const nUrlList = [...urlList];
                                setTitleList(nTitleList.filter((el, index) => index !== i));
                                setUrlList(nUrlList.filter((el, index) => index !== i));
                            }}  className={"deleteButton"}><img className={"clearicon"} src={clear}/></button>
                        </div>)
                    })}
                </ListGroup>}
                {urlList.length === 0 && <div className={"emptyList"}>Your song list is empty. Add some tracks!</div>}
                {dataLoading && <Spinner className={"spinner"} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
                <div id={"reqProcI"} className={"reqProc"}  ref={scrollRef}>
                    {dataLoading && <div >Your request is being processed...</div>}
                </div>
            </div>
        </div>
    )
}
