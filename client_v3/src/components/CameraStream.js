import React, {useEffect} from 'react';
import WebRTCStreamer from 'webrtc-streamer/html/webrtcstreamer';

const CameraStream = ({selectedCameraUrl}) => {
  useEffect( () => {
    const webRtcServer = new WebRTCStreamer("cameraStream", process.env.REACT_APP_MEDIA_SERVER);
    webRtcServer.connect(
      selectedCameraUrl,
      undefined,
      "rtptransport=tcp&timeout=60",
      undefined,
      undefined
    );

    return () => {
      webRtcServer.disconnect();
    }
  }, [selectedCameraUrl]);

  return (
    <div>
      <video id="cameraStream" width="100%" muted playsinline controls></video>
    </div>
  );
}

export default CameraStream;

