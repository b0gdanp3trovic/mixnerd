import React, {useState} from "react";
import axios from "axios";
import Navigation from "../nav/navigation";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import './Recognizer.css'


export default function Recognizer() {
    var image = require('../assets/man-face-with-headphones-sunglasses-and-beard.png');

    const [url, setUrl] = useState('');
    const [error, setError] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [receivedData, setReceivedData] = useState({});
    const [withTimestamps, setWithTimestamps] = useState(false);
    const [shouldShowTimestams, setShouldShowTimestamps] = useState(false);

    function handleClick() {
        if (url.length === 0) {
            setError(true);
            return;
        }
        setReceivedData({});
        setDataLoaded(false);
        setDataLoading(true);
        setError(false);
        const params = {
            url: url,
            timestamps: withTimestamps
        };

        axios.post('http://127.0.0.1:5000/rec', params).then(res => {

            console.log(res.data.map(el => console.log(el)));
            setReceivedData(res.data);
            setDataLoading(false);
            setDataLoaded(true);
            setShouldShowTimestamps(withTimestamps);
            console.log(receivedData);
        }).catch((error) => {
            console.log(error);
            setDataLoading(false);
            setError(true);
        })


    }

    function secondsToMinutesSeconds(time) {
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        var finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

        return finalTime

    }

    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    return (

        <div className="App">
            <Navigation/>
            <div className={"pageContainer"}>
                <Image src={image} className={"image"}/>
                <h1 className={"title"}>Mixnerd</h1>
                <div className={"formContainer"}>
                    <Form className={"mainForm"}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control placeholder="Paste Youtube mixtape link here"
                                          value={url}
                                          onChange={e => setUrl(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Button disabled={dataLoading} className={"button"} onClick={handleClick}
                            variant="light">Listen!</Button>{' '}
                    <label className={"timestamplabel"}>Timestamps:</label>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check disabled={dataLoading} type="checkbox"
                                    onChange={() => setWithTimestamps(!withTimestamps)}/>
                    </Form.Group>
                </div>
                <p className={"tsWarning"}>Plase note that with timestamps, the processing of the file will take a
                    significantly larger amount of time.</p>
                {error && <Toast className={"toastInvalid"}>
                    <Toast.Body>There was an error. Please try again.</Toast.Body>
                </Toast>}
                {dataLoading && <Spinner className={"spinner"} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
                {dataLoaded && <Table className={"songTable"} striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th>Artist(s)</th>
                        <th>Song</th>
                        <th>Album</th>
                        {shouldShowTimestams && <th>Timestamp</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {receivedData.map((element, i) => {
                        return (
                            <tr key={i}>
                                <td>{element.artists}</td>
                                <td>{element.song_name}</td>
                                <td>{element.album_name}</td>
                                {shouldShowTimestams && <td>Around {secondsToMinutesSeconds(element.timestamp)}</td>}
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>}
            </div>
        </div>
    );
}