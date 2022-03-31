import React,{ useState, useEffect, useCallback } from 'react'

export const useHttp = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   
   const request = useCallback(async(url,method = 'GET',body = null,headers = {}) => {
	   setLoading(true);
	   try {
		   if (body) {
			   body = JSON.stringify(body)
			   headers['Content-Type'] = 'application/json'
			   headers['Accept'] = 'application/json'
		   }
		   
		   console.log(body);
		   
		   const response = await fetch(url,{method,body,headers});
		   console.log(response);
		   const data = await response.json();
		   console.log(data);
		   
		   if (!response.ok) {
			   throw new Error(data.message || 'Что-то пошло не так');
		   }
		   
		   setLoading(false);
		   
		   return data;   
	   } catch (e) {
		   setLoading(false);
		   setError(e.message);
		   throw e
	   }
   },[]);
   
   const clearError = () => setError(null)
   
   return {loading, request, error, clearError}
} 