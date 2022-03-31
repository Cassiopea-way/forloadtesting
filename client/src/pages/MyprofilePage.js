import React,{useEffect,useState} from 'react'
import {useHttp} from '../hooks/httphook'

export const MyprofilePage = () => {
	const {loading, error, request} = useHttp();
	const [username,setUsername] = useState('');
	const [usersurname,setUsersurname] = useState('');
	const [userlogin,setUserlogin] = useState('');
	const [useremail,setUseremail] = useState('');
	useEffect(() => {
		const data = request('/MyprofilePage','GET');
		data.then(objuser => {
			setUsername(objuser.username);
			setUsersurname(objuser.usersurname);
			setUserlogin(objuser.userlogin);
			setUseremail(objuser.useremail);
		});
	},[]);
	return (
	  <>
	  <button id = "back">Назад</button>
	   <div id = "profilepanel">
	     <div id = "blockphoto">
	       <div id = "photo">загрузить фото</div>
		   <div id = "loadphoto">
		     <form id = "formimage">
		      <input id = "inputfile" type = "file" accept = "image/png, image/gif, image/jpeg"></input>
			  <button class = "changeinfo"><label for = "file">Загрузить фото</label></button>
			 </form>
		   </div>
	     </div>
		 <div id = "blockinfo">
		   <div id = "userinfo">
		      <table id = "information" border = "1" cellpadding = "0" cellspacing = "0" width = "300" height = "240">
			     <tr><td>Имя</td><td>{username}</td><td><button id = "changename" class = "changeinfo">изменить</button></td></tr>
				 <tr><td>Фамилия</td><td>{usersurname}</td><td><button class = "changeinfo">изменить</button></td></tr>
				 <tr><td>Логин</td><td>{userlogin}</td><td><button class = "changeinfo">изменить</button></td></tr>
				 <tr><td>Пароль</td><td>********</td><td><button id = "changepassword">изменить</button></td></tr>
				 <tr><td>Эл.почта</td><td>{useremail}</td><td><button class = "changeinfo">изменить</button></td></tr>
			  </table>
		   </div>
		   <div id = "checkinfo">
		      <table id = "checkinformation" cellpadding = "0" cellspacing = "0" width = "300" height = "60">
			     <tr><td>Адрес электронной почты не подтверждён</td><td><button class = "checkinfo">подтвердить</button></td></tr>
				 <tr><td>Номер телефона не подтверждён</td><td><button class = "checkinfo">подтвердить</button></td></tr>
			  </table>
		   </div>
		 </div>
	   </div>
	   </>
	)
}