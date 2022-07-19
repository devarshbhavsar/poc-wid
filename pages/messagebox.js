import { useEffect, useState } from "react";
import { createMessageBoxWidget } from "@livechat/agent-app-sdk";

export default function MessageBox() {
    const [widget, setWidget] = useState(null);
    var message = {};

    //useEffect(() => {
    //    createMessageBoxWidget().then((widget) => {
    //    setWidget(widget);
    //  })
    //}, []);    

    const getMessage = async() => {
        const response = await fetch('https://poc-widget.vercel.app/api/message');
        message = await response.json();
        // message = data.toString();
    }
    getMessage();

    function sendCarousel() {
        //widget.putMessage(message);
        console.log(JSON.parse(message))
    }

    return (
        <div style={{margin:"20px"}}>
            <p>Click to send Carousel</p>
            <button className="btn btn-primary" type="button" onClick={sendCarousel}>Send Carousel</button>
        </div>
    )

}