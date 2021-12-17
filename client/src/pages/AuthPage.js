import React,{useState,useContext} from 'react'
import {UserContext} from './../hooks/UserContext'
import {useHttp} from '../hooks/httphook'

export const AuthPage = () => {
	const {loading, error, request} = useHttp();
	const [form, setForm] = useState({userLogin: '',userPassword: ''});
	
	const changeHandler = event => {
		setForm({...form,[event.target.name]: event.target.value});
	}
	
	const loginHandler = async () => {
		try {
			const data = await request('/admin','POST',{...form});
			console.log('data:',data);
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