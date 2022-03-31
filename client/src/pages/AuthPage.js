import React,{useState,useContext} from 'react'
import {useNavigate} from "react-router-dom"
import {useHttp} from '../hooks/httphook'
import {UserContext} from './../hooks/UserContext'

export const AuthPage = (props) => {
	let navigate = useNavigate();
	const {loading, error, request} = useHttp();
	const [form, setForm] = useState({userLogin: '',userPassword: ''});
	const [user,isLoading,setUser] = useContext(UserContext);
	
	const changeHandler = event => {
		setForm({...form,[event.target.name]: event.target.value});
	}
	
	const loginHandler = async () => {
		try {
			const data = await request('/admin','POST',{...form});
			console.log('data:',data);
			setUser(data.user);
			navigate('/');
		} catch(e) {
			throw e;
		}
	}
	
	return (
	  <div>
	      <label>Логин</label>
          <input type="text" onChange = {changeHandler} name="userLogin" />
          <label>Пароль</label>
          <input type="text" onChange = {changeHandler} name="userPassword" />
          <button id = "entermain" className = "btns" onClick = {loginHandler} disabled = {loading}>Войти</button>
		  <button id = "registeruser" className = "btns">Зарегистрироваться</button>
	  </div>
	);
}