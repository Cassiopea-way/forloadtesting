import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from './../hooks/UserContext'
import {useHttp} from '../hooks/httphook'
import {MessageList} from './../components/MessageList'
import {UsersList} from './../components/UsersList'
import {SocketContext,socket} from './../hooks/socket'
import {nanoid} from 'nanoid'

export const Test2Page = () => {
	const [inputValue,setInputValue] = React.useState('');
	const [messageareaValue,setMessageareavalue] = React.useState('');
	const [messages,setMessages] = React.useState([]);
	const [addmessage,setAddmessage] = React.useState({authuser: '',usermessage: ''});
	const {user,isLoading} = React.useContext(UserContext);
	const [loaduser,setLoaduser] = React.useState({joinuser:''});
	const [loadusers,setIsloadusers] = React.useState(false);
	const [loadmessages,setLoadmessages] = React.useState(false);
	const [joinedusers,setJoinedusers] = React.useState([]);
	const {loading, error, request} = useHttp();
	
	window.socket = socket;
	
	const onSendMessage = (e) => {
		e.preventDefault();
		let obj = {};
		obj.authuser = user;
		obj.usermessage = inputValue;
		obj._id = nanoid();
		setMessages(prevMessages => [...prevMessages,obj]);
		socket.emit('NEW_MESSAGE',({user,inputValue}));
		setInputValue('');
	}
	
	useEffect(() => {
		const copy = Object.assign({},loaduser);
	    copy.joinuser = user;
		socket.emit('JOIN',copy);
		setIsloadusers(true);
		
		const data = request('/getusers','GET');
		console.log(data);
		data.then(newusers => {
			console.log(newusers);
			let usersinroom = [];
			for (let i = 0; i < newusers.length; i++){
				usersinroom.push(newusers[i].joinuser);
			}
			setJoinedusers([...joinedusers,...usersinroom]);
		});
		
		socket.on('JOINED',(users) => {
			console.log('новый ползователь',users);
			setJoinedusers([...joinedusers,...users]);
			console.log(joinedusers);
		});
		
		socket.on('GETMESSAGES',(usermessages) => {
			console.log('новое сообщение',usermessages);
			setMessages([...messages,...usermessages]);
			setLoadmessages(true);
			console.log(messages);
		});
		
		socket.on('SET_MESSAGE',(newmessage) => {
			console.log('добавляем сообщение',newmessage);
			setMessages(prevMessages => [...prevMessages,...newmessage]);
			console.log(messages);
		});
		
		socket.on('LEAVE',(stayusers) => {
			setJoinedusers(stayusers.filter(x => !joinedusers.includes(x)));
			console.log('user leaved');
		});
	},[])
	
	return (
	 <SocketContext.Provider value={socket}>
	  <div id = "chat">
	      <div id = "chatusers"><UsersList loading={loadusers} users={joinedusers}/></div>
	  <div id = "columnblock">
		  <div id = "chatblock">
		    <MessageList loadingmessages={loadmessages} messagehistory={messages}/>
		  </div>
		  <div id = "rowblock">
		    <input id = "chatmessage" type = "text" placeholder = "Введите сообщение..." value = {inputValue} onChange={e => setInputValue(e.target.value)}></input>
		    <button id = "messagesend" onClick={onSendMessage}>send</button>
	      </div>
	  </div>
	  </div>
	 </SocketContext.Provider>
	)
}