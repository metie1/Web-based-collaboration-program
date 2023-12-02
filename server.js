const express = require('express');
const socket = require('socket.io')
const session = require('express-session');
const http = require('http')
const fs = require('fs')
const path = require('path');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);

var authRouter = require('./lib_login/auth.js');
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');

const app = express()

const server = http.createServer(app)
const io = socket(server)

const port = 3000;
/*
// 연결 오류 재시작 부분
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '203.234.62.187',
    port: 7999,
    user: 'tester',
    password: '1234',
    database: 'my_db',
});

function handleDisconnect() {
    connection.connect((err) => {
        if (err) {
        console.log('Error when connecting to MySQL:', err);
        setTimeout(handleDisconnect, 2000); // 재시도 간격 (2초)
        }
    });

    connection.on('error', (err) => {
        console.log('MySQL error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        handleDisconnect();
        } else {
        throw err;
        }
    });
}
handleDisconnect();
*/

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if(err) {
            response.send('에러')
        } else {
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

io.sockets.on('connection', function(socket) {
    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.on('newUser', function(name) {
        console.log(name + ' 님이 접속하였습니다.')

        /* 소켓에 이름 저장해두기 */
        socket.name = name
    
        /* 모든 소켓에게 전송 */
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    })

    /* 전송한 메시지 받기 */
    socket.on('message', function(data) {
      /* 받은 데이터에 누가 보냈는지 이름을 추가 */
        data.name = socket.name
        
        console.log(data)
    
        /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', data);
    })

    /* 접속 종료 */
    socket.on('disconnect', function() {
        console.log(socket.name + '님이 나가셨습니다.')
    
        /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
})



app.use(bodyParser.json());         // JSON 파싱을 위한 미들웨어
app.use(express.static('public'));

/* 인트로 부분 */
// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'views')));

// 루트 경로로 접속했을 때 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'intro.html'));
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '~~~',	// 원하는 문자 입력
    resave: false,
    saveUninitialized: true,
    store:new FileStore(),
}))

app.get('/', (req, res) => {
    if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
        res.redirect('/auth/login');
        return false;
    } else {                             // 로그인 되어있으면 메인 페이지로 이동시킴
        res.redirect('/main');
        return false;
    }
})

// 인증 라우터
app.use('/auth', authRouter);

// 메인 페이지
app.get('/main', (req, res) => {
    if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
        res.redirect('/auth/login');
        return false;
    }

    /*
    var html = template.HTML('Welcome',
        `<hr>
            <h2>메인 페이지에 오신 것을 환영합니다</h2>
            <p>로그인에 성공하셨습니다.</p>`,
        authCheck.statusUI(req, res)
    );
    */
    
    // 로그인 되어있으면 main.html 파일을 렌더링
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
    //res.send(html);
})

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});