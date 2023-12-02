module.exports = {
    HTML: function (title, body, authStatusUI) {
        return `
        <!doctype html>
        <html>

        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <title>로그인</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                }

                header {
                    text-align: center;
                    padding: 20px;
                    background-color: #ffffff;
                    color: #333;
                }

                header h1 {
                    font-size: 36px;
                    margin: 0;
                }

                nav {
                    padding: 10px 0;
                    background-color: #f1f3f5;  
                }

                .nav-tabs .nav-link {
                    color: #333;
                    font-size: 18px;
                }

                .nav-tabs .nav-link.active {
                    color: #007bff;
                    font-weight: bold;
                }

                section {
                    text-align: center;
                    padding: 40px 0;
                }

                footer {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background-color: #333;
                    text-align: center;
                    padding: 20px 0;
                }

                footer a {
                    color: #fff;
                    text-decoration: none;  
                    margin: 0 10px;
                }

                #myprofileTopBox, #myprofileBodyBox, #myprofileVerifyBox {
                    border: 1px solid #ccc;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }

                #myprofileTopBox p {
                    margin: 0;
                    font-size: 24px;
                    color: #333;
                }

                #myprofileBodyBox p {
                    margin: 0;
                    font-size: 20px;
                    color: #333;
                }

                #myprofileVerifyBox p {
                    margin: 0;
                    font-size: 18px;
                    color: #333;
                }

                #myprofileVerifyBox a {
                    display: block;
                    margin-top: 10px;
                    font-size: 16px;
                    color: #007bff;
                    text-decoration: none;
                }


                #loginContainer {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 30px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    text-align: center;
                }

                #loginContainer p {
                    margin: 0;
                    font-size: 24px;
                    color: #333;
                }

                #loginContainer img {
                    max-width: 50px;
                    vertical-align: middle;
                }

                #loginContainer form {
                    margin-top: 20px;
                }

                #loginContainer input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }

                #loginContainer input[type="submit"] {
                    background-color: #505050;
                    color: #fff;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                #loginContainer input[type="submit"]:hover {
                    background-color: #b3b3b3;
                }

                #signupButton {
                    margin-top: 10px;
                }

                #signupButton a {
                    font-size: 16px;
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>


        <body>
            <div class="loginContainer">
            ${authStatusUI}
            ${body}
            </div>
        </body>
        </html>
        `;
    }
}