import React,{ useState, useEffect } from 'react'

 export default function useFindUser() {
 const [user, setUser] = useState(null);
 const [isLoading, setLoading] = useState(true);
   useEffect(() => {
     async function findUser() {
       await fetch('/api')
        .then(response => response.text())
		.then(user => {
			setUser(user);
			setLoading(true);
        }). catch(err => {
           setLoading(false);
        });
    }
    findUser();
  }, []);
   return {
    user,
    isLoading
   }
 }