import React,{ useState, useEffect } from 'react'

 export default function useFindUser() {
  
   return fetch('/api')
        .then(response => response.text())
		.then(user => {
			return {
				user: 'eee',
				isLoading: true
			   }
        }). catch(err => {
          return {
				isLoading: false
			   }
        });
 }