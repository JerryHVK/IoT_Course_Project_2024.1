import React, { useEffect, useRef } from "react";

const RTSPStream = ({ rtspUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      // Fetch the WebRTC offer from the WebRTC-Streamer server
      // const response = await fetch(
      //   `http://localhost:8000/api/stream?url=${encodeURIComponent(rtspUrl)}`,
      //   { method: "POST" }
      // );
      const response = await fetch(
        `http://localhost:8000/webrtcstreamer.html?rtsp://192.168.100.248`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.sdp) {
        const peerConnection = new RTCPeerConnection();

        // Add all ICE candidates
        data.iceCandidates.forEach((candidate) => {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // Set the remote description with the SDP from the server
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription({
            type: "offer",
            sdp: data.sdp,
          })
        );

        // Create an answer for the SDP
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Send the answer back to the server
        await fetch(
          `http://localhost:8000/api/stream?url=${encodeURIComponent(rtspUrl)}`,
          {
            method: "POST",
            body: JSON.stringify({ sdp: answer.sdp }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Set the video stream to the video element
        peerConnection.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };
      }
    };

    startStream();
  }, [rtspUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      ></video>
    </div>
  );
};


export default RTSPStream;
