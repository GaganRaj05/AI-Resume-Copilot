const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

const early = async(userEmail)=> {
    try{
        const response =  await fetch(`${BACKEND_URL}/early-users`,{
            method:'POST',
            headers:{'Content-type': 'application/json'},
            body:JSON.stringify(userEmail)
        });

        const data = await response.json();
        if(!response.ok) return {error:data};
        return data;
    }
    catch(err) {
        console.log(err.message);
        return {error:err.message};
    }
}

export {early};