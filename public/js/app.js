const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

async function startVideoCall() {
    console.log('startVideoCall 함수 시작');
    try {
        // navigator.mediaDevices.getUserMedia를 사용하도록 수정
        const getUserMedia = navigator.mediaDevices.getUserMedia;


        if (getUserMedia) {
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
            
            console.log('startVideoCall 함수 성공');
        } else {
            console.error('getUserMedia가 지원되지 않습니다.');
        }
    } catch (error) {
        console.error('미디어 디바이스 액세스 에러:', error);
    }
}