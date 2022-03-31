const express = require("express");
let http = require("http");
const app = express();
let server = http.createServer(app);
let cors = require('cors');
let io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});
let nodemailer = require('nodemailer');
let smtptransport = require('nodemailer-smtp-transport');
let fs = require('fs');
const multer = require('multer');
let favicon = require('serve-favicon');
//let cors = require('cors');
let path = require('path');
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
let bcrypt = require('bcryptjs');

let randomnumberSMS;

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

let smtpTransport = nodemailer.createTransport(smtptransport({
    host:"smtp.mail.ru",
    port:'465',
    //host:"localhost",
    //port:'8888',
    secure:'true',
    /*tls: {
        rejectUnauthorized:false
    },*/
    auth: {
        user:"",
        pass:"",
    },
    
}));

let dbClient;
 
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

app.use(session({
	secret:'secret key',
	ttl:60,
	saveUninitialized:true,
	resave:true,
	store: MongoStore.create({
		mongoUrl:'mongodb://localhost:27017/',
		dbName:'basesessions',
		collectionName:'testsessions',
	})
}));

mongoClient.connect(function(err, client){
 
    if(err){
        return console.log(err);
    }

    dbClient = client;
    //app.locals.collection = client.db("test").collection("users");
    app.locals.collection = client.db("test");
    // взаимодействие с базой данных
    console.log('database-->OK');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//app.use(cors);

app.use(favicon((__dirname + '/public/images/favicon.ico')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/pages'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/client'));

const storageimage = multer.diskStorage({
    destination:(request,file,cb) => {
      cb(null,"uploads");
    },
    filename:(request,file,cb) => {
        let sessionData = request.session;
        let format = file.originalname;
        cb(null,sessionData.user.username + format.substr(-4));
    }
})

const upload = multer({storage:storageimage});

app.use(multer({storage:storageimage}).single("file"));

io.on('connection',(socket) => {
      console.log('user connected :',socket.id);
        const collection = app.locals.collection;

        socket.on('JOIN',async(data) => {
          console.log(data);
          data.socketid = socket.id;
         
         let queries = [new Promise(function(resolve,reject){
                         collection.collection("chatroom").insertOne(data,function(err, insertuser){    
                         console.log('1');
                         resolve();
                         if(err) return console.log(err);
                       });
                       }),
                       new Promise(function(resolve,reject){
                         collection.collection('chatroom').find().toArray(function(err,chatroomusers){
                         console.log(chatroomusers);
                         console.log('2');
                         let usersinroom = [];
                         for (let i = 0; i < chatroomusers.length; i++){
                           usersinroom.push(chatroomusers[i].joinuser);
                         }
                         console.log(usersinroom);
                         resolve(usersinroom);
                         if (err) throw err;
                         });
                       }),
                       new Promise(function(resolve,reject){
                         collection.collection('chatmessages').find().toArray(function(err,messages){
                         console.log(messages);
                         console.log('3');
                         resolve(messages);
                       });
                       })

         ];

         console.log(queries);

         Promise.all(queries).then(function(results){
           console.log(results);
           socket.broadcast.emit('JOINED',results[1]);
           socket.emit('GETMESSAGES',results[2]);
         }).catch(function(err){
           console.log(err);
         });

        });

        /*socket.emit('CONNECTION_USER',(data) => {
          console.log('user connected');
        });*/

        socket.on('NEW_MESSAGE',async(data) => {
          console.log(data);
          let copy = {};
          copy.authuser = data.user;
          copy.usermessage = data.inputValue;
          let messageid;
          
          let queries = [new Promise(function(resolve,reject){
                           collection.collection('chatmessages').insertOne(copy,function(err, insertmessage){
                           console.log('4');
                           console.log(insertmessage);
                           resolve();
                           if(err) return console.log(err);
                        }); 
                        }),
                        new Promise(function(resolve,reject){
                           collection.collection('chatmessages').find().limit(1).sort({$natural:-1}).toArray(function(err,findmessage){
                           console.log(findmessage);
                           console.log('5');
                           resolve(findmessage);
                           if(err) return console.log(err);
                        });
                        })];

          console.log(queries);

          Promise.all(queries).then(function(results){
          console.log(results);
          socket.broadcast.emit('SET_MESSAGE',results[1]);
         }).catch(function(err){
            console.log(err);
         }); 

        });

        socket.on('disconnect',async() => {
            console.log('disconnected');
            
            let queries = [new Promise(function(resolve,reject){
                            collection.collection('chatroom').deleteOne({socketid:socket.id},function(err,deleteuser){
                            console.log('6');
                            console.log(deleteuser);
                            resolve();
                            if (err) return console.log(err);
                          });
                          }),
                          new Promise(function(resolve,reject){
                            collection.collection('chatroom').find().toArray(function(err,chatroomusers){
                            console.log(chatroomusers);
                            console.log('7');
                            let usersinroom = [];
                            for (let i = 0; i < chatroomusers.length; i++){
                              usersinroom.push(chatroomusers[i].joinuser);
                            }
                            console.log(usersinroom);
                            resolve(usersinroom); 
                            if (err) throw err;
                          });
                          })
            ];

            console.log(queries);

            Promise.all(queries).then(function(results){
            console.log(results);
            socket.broadcast.emit('LEAVE',results[1]);
         }).catch(function(err){
            console.log(err);
         }); 

        });
      });

function getRandomInt(min,max){
  return Math.floor(Math.random()*(max - min + 1)) + min;
}

app.get("/api",function(request,response){
     console.log(request.session);
  if (request.session.hasOwnProperty('user') === false){
      response.send('пользователь не авторизован');
  } else {
      console.log(request.session.user.username);
      response.send(request.session.user.username);
  }
    
});

app.get("/getusers",function(request,response){
   const collection = app.locals.collection;
   collection.collection('chatroom').find().toArray(function(err,chatroomusers){
      console.log(chatroomusers);
      response.send(chatroomusers);
   });
});

/*app.get("/login",function(request,response){
    response.render('login');
    //response.render('login');
});*/

app.post("/admin",function(request,response){

    let login = request.body.userLogin;
    let password = request.body.userPassword;
    let foundUser;
    let check;
    let correctpass;
    console.log(request.body);
    console.log(login);
    console.log(password);
    const collection = request.app.locals.collection;

    collection.collection('users').findOne({userLogin:login},function(err, correctuser){
        //console.log(collection);
        if(err) return console.log(err);
         //response.send(users);
        if (correctuser == undefined){

           console.log("Login failed: ",request.body.userlogin);
           response.status(401).send('Login Error');

        } else {
           correctpass = correctuser.userPassword;
           check = bcrypt.compareSync(password,correctpass);
           if (check == true){
           let sessionData = request.session;
           sessionData.user = {};
           let username = login;
           sessionData.user.username = username;
           let pathredirect;
           if (username == "admin"){
             pathredirect = "admin";
           } else {
             pathredirect = "user";
           }
           console.log("Login succeeded: ",sessionData.user.username);
           console.log('Login successfull ' + 'sessionID: ' + request.session.id + '; user: ' + sessionData.user.username);
           //response.send('Login successfull ' + 'sessionID: ' + request.session.id + '; user: ' + sessionData.user.username);
           response.json({"user":username,"authstatus":"auth is OK"});
          }
        }
   
    })

});

/*app.get('/difficulty',function (request,response){
	if (request.session.userLogin){
		response.set('Content-Type','text/html');
		response.send('<h2>User ' + request.session.userLogin + 'is logged in </h2>');

	} else {
		response.send('not logged in');
	}
});*/

app.get('/logout',function(request,response){
    request.session.destroy(function(err){
      if (err) {
        throw err;
      } else {
        console.log('logged out');
        response.send('logged out!');
      }
    });
});

app.get('/admin',function(request,response){
	let sessionData = request.session;
	console.log(sessionData.user.username);
	if (sessionData.user.username == 'admin'){
		console.log(sessionData.user.username + ' requested admin page');
		response.render('admin');
	} else {
		response.status(403).send('Access Denied!');
	}
});

app.post("/login",function(request,response){
    let username = request.body.username;
    let usersurname = request.body.usersurname;
	let login = request.body.userlogin;
	let password = request.body.userpassword;
	let email = request.body.useremail;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password,salt);

    let User = {userName:username,
    	        userSurname:usersurname,
    	        userLogin:login,
    	        userPassword:hash,
    	        userEmail:email,
                useremailActive:false,
                userPhone:"",
                userPhoto:"",
                languages: [ 'english', 'spanish', 'russian' ]
    	        };
   
    const collection = request.app.locals.collection;
    collection.insertOne(User,function(err, insertuser){
        //console.log(collection);
        if(err) return console.log(err);
        response.redirect('/');

    });

});

app.get('/user',function(request,response){
	let sessionData = request.session;
    console.log(sessionData.user.username);
    console.log(request.url);
	if (sessionData.user.username != "admin"){
		console.log(sessionData.user.username + ' requested user page');
		response.render('user');
	} else {
		response.status(403).send('Access Denied!');
	}
});

app.get('/MyProfilePage',function(request,response){
    let sessionData = request.session;
    const collection = request.app.locals.collection;
    collection.findOne({userLogin:sessionData.user.username},function(err,user){
        let objuser = {
           username:user.userName,
           usersurname:user.userSurname,
           userlogin:user.userLogin,
           useremail:user.userEmail,
           userphoto:user.userPhoto
        };
        response.json(objuser);
    });
});

app.get('/test2',function(request,response){
   let sessionData = request.session;
   const collection = request.app.locals.collection;
   collection.collection("users").findOne({userLogin:sessionData.user.username},function(err,user){
     
   });
   
});

app.put('/user/myprofile',function(request,response){
    let sessionData = request.session;
    const collection = request.app.locals.collection;
    let changeinfo = request.body;
    console.log(request.body);
    console.log(request.body.userName);
    console.log(request.body.change);
    console.log(changeinfo.change);
    
        if (changeinfo.userName !== undefined){
          collection.updateOne(
            {userName:request.body.userName},
            { $set: {userName:request.body.change}},
            function(err,result){
                console.log(result);
            }
          );
        }

        if (changeinfo.usersurName !== undefined){
          collection.updateOne(
            {usersurName:request.body.usersurName},
            { $set: {usersurName:request.body.change}},
            function(err,result){
                console.log(result);
            }
          );
        }

        if (changeinfo.userLogin !== undefined){
          sessionData.user.username = changeinfo.userLogin;
          collection.updateOne(
            {userLogin:request.body.userLogin},
            { $set: {userLogin:request.body.change}},
            function(err,result){
                console.log(result);
            }
          );
        }

        if (changeinfo.userEmail !== undefined){
          collection.updateOne(
            {userEmail:request.body.userEmail},
            { $set: {userEmail:request.body.change}},
            function(err,result){
                console.log(result);
            }
          );
        }
 
});

app.post('/uploads',upload.single('file'),function(request,response){
    let filedata = request.file;
    let loadfilename = filedata.filename;
    console.log(filedata);
    if (!filedata){
        response.send("Ошибка при загрузке файла");
    } else {
        console.log('Файл загружен');
        response.setHeader("Content-Type","image/jpeg");
        fs.readFile("/programms/nodejs/domains/digital/uploads/" + loadfilename,(err,image) => {
            if (err) throw err;
            response.end(image);
        });
        //response.send("Файл загружен");
    }
});

app.put('/uploads',upload.single('file'),function(request,response){
    let filedata = request.file;
    let loadfilename = filedata.filename;
    let sessionData = request.session;
    const collection = request.app.locals.collection;
    collection.updateOne(
            {userLogin:sessionData.user.username},
            { $set: {userPhoto:loadfilename}},
            function(err,result){
                console.log(result);
            }
          );
});

app.get('/user/myprofile/changepassword',function(request,response){
   response.render('changepassword');
});

app.put('/user/myprofile/changepassword',function(request,response){

   let sessionData = request.session;
   const collection = request.app.locals.collection;
   let newpassword = request.body.repeatpassword;
   let salt = bcrypt.genSaltSync(10);
   let hash = bcrypt.hashSync(newpassword,salt);

    collection.updateOne(
            {userLogin:sessionData.user.username},
            { $set: {userPassword:hash}},
            function(err,result){
                console.log(result);
            }
          );
   console.log(sessionData.user);
});

app.get('/send',function(request,response){
    let host = request.headers.host;
    console.log(host);
    //let salt = bcrypt.genSaltSync(10);
    let rand = Math.floor((Math.random()*100) + 54);
    //let hash = bcrypt.hashSync(rand,salt);
    let link = "http://" + host + "verify?id=" + rand;

    let sessionData = request.session;
    const collection = request.app.locals.collection;
    //collection.findOne({userLogin:sessionData.user.username},function(err,user){
        let mailOptions = {
        from:"Nodemailer test <marochkins@bk.ru>",
        to:"aleksandr.rykunov@yandex.ru",
        subject:"Please confirm your Email account",
        html: "Hello, <br> Please click on the link to verify your email.<br><a href = "+link+">Click here to verify</a>"
      };
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions,function(error,emailmessage){
        if(error){
            console.log(error);
            response.end("error");
        } else {
            console.log("message sent: " + emailmessage);
            //response.end("sent");
        }
    });

    });
//});

app.get('/verify',function(request,response){
    console.log(request.protocol+"://"+request.headers.host);
    if((request.protocol+"://"+request.headers.host) == ("http://"+request.headers.host)){
        console.log("Domain is matched. Information is from Authentic email");
        if (request.query.id == rand){
            console.log("email is verifed");
            response.end("<h1>Email "+mailOptions.to+" is been Successfully verifed");
        } else {
            console.log("email is not verifed");
            response.end("<h1>Bad Request</h1>");
        }
    }
});

app.get('/sendSMS',function(request,response){
   const accountSid = '';
   const authToken = '';

   const client = require('twilio')(accountSid,authToken);

   randomnumberSMS = getRandomInt(1000,9999);
   
   client.messages
     .create({
        body:'Ваш код подтверждения: ${randomnumberSMS}',
        from:'+17242515396',
        to:'+79276862160'
     })
     .then(message => response.redirect('/verifySMS'));
   response.redirect('/verifySMS');

});

app.get('/verifySMS',function(request,response){
    console.log(randomnumberSMS);
    response.render('verifySMS',{codeSMS:randomnumberSMS});
});

app.post('/SMSisverify',function(request,response){
    let code = request.body.proofcode;
    console.log(request.body);
    console.log(code);
    if (code != randomnumberSMS){
        response.send('Неверный код');
    } else {
        response.redirect('/user/myprofile'); 
    }  
});

app.post('/addmessage',function(request,response){
    const collection = request.app.locals.collection;
    collection.collection("chatmessages").insertOne(request.body,function(err, insertmessage){
        //console.log(collection);
        console.log(request.body);
        console.log('1');
        if(err) return console.log(err);
        response.send('message added');

    });
});

app.get('/guest',function(){	
		response.render('guest page');
});

app.get('/register',function(request,response){	
		response.render('register');
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});


server.listen(8888);