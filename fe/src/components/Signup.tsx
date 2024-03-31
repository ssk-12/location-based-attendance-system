import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { emailState, passwordState, usernameState, messageState } from '../state/atom';

export function Signup() {
    const [username, setUsername] = useRecoilState(usernameState);
    const [email, setEmail] = useRecoilState(emailState);
    const [password, setPassword] = useRecoilState(passwordState);
    const [message, setMessage] = useRecoilState(messageState);

    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://be.ullegadda-srikanta.workers.dev/api/v1/user/signup', {
                name: username,
                email,
                password,
            });

            const { jwt, message } = response.data;

            console.log(message);

            if (jwt) {
                localStorage.setItem('token', jwt);
                localStorage.setItem('username', email); 
                setMessage("Signup success. Please login.");
                navigate('/dashboard');
            } else {
                setMessage(message || "Couldn't sign up.");
            }

        } catch (error: any) {
            console.error('Signup error:', error.response?.data || error.message);
            setMessage(error.response?.data.message || error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="h-screen w-full m-auto bg-slate-100 flex flex-col justify-center items-center">
            <div className="text-3xl font-extrabold">
                Sign up for an account
            </div>
            <div className="mt-1 text-slate-500 font-medium">
                Already have an account?{" "}
                <Link to="/signin" className="underline text-zinc-500 hover:text-zinc-700">Sign in</Link>
            </div>
            <form className="w-full flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <div className="mt-4">
                    <div className="font-medium">Username</div>
                    <div className="mt-1">
                        <input 
                            className="rounded-sm p-1 border-zinc-500 w-[350px]" 
                            type="text" 
                            placeholder="Enter your name" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="font-medium">Email</div>
                    <div className="mt-1">
                        <input 
                            className="rounded-sm p-1 border-zinc-500 w-[350px]" 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="font-medium">Password</div>
                    <div className="mt-1">
                        <input 
                            className="rounded-sm p-1 border-zinc-500 w-[350px]" 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                </div>
                {message && (
                    <div className="mt-3 text-slate-500">
                        {message}
                    </div>
                )}
                <div className="mt-6">
                    <button className="bg-black text-white rounded-md p-1 w-[350px]" type="submit">Sign Up</button>
                </div>
                
            </form>
        </div>
    );
}
