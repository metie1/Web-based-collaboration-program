const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');  // path 모듈 추가

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public'), { 'Content-Type': 'application/javascript' }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
    console.log('클라이언트 연결');

    // 클라이언트로부터 메시지를 수신할 때
    ws.on('message', message => {
        console.log(`수신한 메시지: ${message}`);

        // 수신한 메시지를 다른 클라이언트에게 전달
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});

/*
server.listen(3000, '0.0.0.0', () => {
    console.log('시그널링 서버 시작: http://localhost:3000');
});
*/