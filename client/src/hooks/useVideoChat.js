import {useEffect, useRef, useState} from "react";
import Peer from "simple-peer";

import {useLocalStorage} from "./useLocalStorage";

export const useVideoChat = (roomId, socketRef) => {
    const [peers, setPeers] = useState([]);

    const [userId] = useLocalStorage('userId')

    const userVideoRef = useRef()
    const peersRef = useRef([])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            userVideoRef.current.srcObject = stream
            const peers = []
            socketRef.current.emit('userArray:get')
            socketRef.current.on('all users array', users => {
                users.forEach(userID => {
                    const peer = createPeer(userID, userId, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers( users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, [socketRef])

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return { userVideoRef, peers }
}
