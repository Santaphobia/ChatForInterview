import styled from "styled-components";
import {useEffect, useRef} from "react";

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

export function Video(props)  {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, [props.peer]);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}
