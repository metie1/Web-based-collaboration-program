// public/app.js
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

async function startVideoCall() {
    try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const peerConnection = new RTCPeerConnection(configuration);

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = event => {
            const remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Offer를 서버로 전송
        ws.send(JSON.stringify({ type: 'offer', data: offer }));

        // Answer를 서버로부터 수신
        ws.onmessage = async event => {
            const data = JSON.parse(event.data);
            if (data.type === 'answer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data));
            }
        };
    } catch (error) {
        console.error('미디어 디바이스 액세스 에러:', error);
    }
}