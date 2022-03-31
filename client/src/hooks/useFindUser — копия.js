import React,{ useState, useEffect } from 'react'

 export default async function useFindUser() {
   const [user, setUser] = useState(null);
   const [isLoading, setLoading] = useState(false);
   useEffect(() => {
     async function findUser() {
       return await fetch('/api')
        .then(response => response.text())
		.then(user => {
			setUser(user);
			setLoading(true);
        }). catch(err => {
           setLoading(false);
        });
    }
    await findUser();
  }, []);
  
   return {
    user,
    isLoading
   }
 }