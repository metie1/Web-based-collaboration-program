const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);

var authRouter = require('./lib_login/auth.js');
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');

const app = express()
const port = process.env.PORT || 4000;



const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '203.234.62.187',
    port: 7999,
    user: 'tester',
    password: '1234',
    database: 'my_db'
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
    } else {                                      // 로그인 되어있으면 메인 페이지로 이동시킴
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
    var html = template.HTML('Welcome',
        `<hr>
            <h2>메인 페이지에 오신 것을 환영합니다</h2>
            <p>로그인에 성공하셨습니다.</p>`,
        authCheck.statusUI(req, res)
    );
    res.send(html);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})