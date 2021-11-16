import { useState } from "react";

const Login = (props) => {
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const url = process.env.PUBLIC_URL

    const doLogin=()=>{
        if(name==="" || password===""){
            alert("Enter a username and password");
            return;
        }

        props.setIsLoading(true)
        setTimeout(()=>
            fetch(`${url}/api/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name,password})
            })
            .then(response => {
                if(!response.ok){
                    throw("Unauthorized");
                }
                props.setIsLoading(false)
                return response.json(); // returns another promise
            })
            .then(data => {
                props.closeLogin();
                props.setUser(data);
                localStorage.setItem("user",JSON.stringify(data));
            })
            .catch(err=>{
                alert("Login Failed");
                props.setIsLoading(false)
                console.log("Error: ",err)
            }),1000);
    }


    
    const doRegister=()=>{
        if(name==="" || password===""){
            alert("Enter a username and password");
            return;
        }

        props.setIsLoading(true)
        setTimeout(()=>
            fetch(`${url}/api/users`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name,password})
            })
            .then(response => {
                if(!response.ok){
                    throw("Unauthorized");
                }
                props.setIsLoading(false)
                return response.json(); // returns another promise
            })
            .then(data => {
                props.closeLogin();
                props.setUser(data);
                localStorage.setItem("user",JSON.stringify(data));
            })
            .catch(err=>{
                alert("Registration Failed");
                props.setIsLoading(false)
                console.log("Error: ",err)
            }),1000);
    }
    return (
        <div className="authWindow">
            <label htmlFor="userName">Username</label>
            <input type="text" id="userName" onChange={
                e=>setName(e.target.value)
            }></input>
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={
                e=>setPassword(e.target.value)
            }></input>
            <br /><br />
            <button onClick={doLogin}>Login</button>
            <button onClick={doRegister}>Register</button>
            <button onClick={props.closeLogin}>Close</button>
        </div>
    );
};

export default Login;