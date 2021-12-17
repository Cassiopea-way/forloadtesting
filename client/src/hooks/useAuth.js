import {useState,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from './UserContext'


export default function useAuth(){
	let history = useHistory();
	const {setUser} = useContext(UserContext);
	const [error,setError] = useState(null);
	const setUserContext = async() => {
		return await fetch('/api')
		.then(response => response.text())
		.then(user => {
			setUser(user);
			history.push('/');
		})
		.catch((err) => {
			setError(err);
		})
	}
	return {
		error
	}
}