import { BroadcastChannel } from "broadcast-channel";

export default function Board() {
    const bc = new BroadcastChannel("scoreboard");
    bc.onmessage = (event) => {
        console.log(event);
    };
    return <div></div>;
}
