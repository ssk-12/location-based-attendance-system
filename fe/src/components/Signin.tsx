import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { emailState, passwordState, messageState } from '../state/atom';

export function Signin() {
    const [email, setEmail] = useRecoilState(emailState);
    const [password, setPassword] = useRecoilState(passwordState);
    const [message, setMessage] = useRecoilState(messageState);

    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8787/api/v1/user/signin', {
                email,
                password,
            });

            const { jwt, message } = response.data;

            console.log(jwt);

            if (jwt) {
                localStorage.setItem('username', email);
                localStorage.setItem('token', jwt);
                
                setMessage("Login success.");
                navigate('/dashboard');
            } else {
                setMessage(message || "Couldn't sign in.");
            }

        } catch (error: any) {
            console.error('Signin error:', error.response?.data);
            setMessage(error.response?.data.error || error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="h-screen w-full m-auto bg-slate-100 flex flex-col justify-center items-center">
            <div className="text-3xl font-extrabold">
                Sign in to your account
            </div>
            <div className="mt-1 text-slate-500 font-medium">
                Don't have an account?{" "}
                <Link to="/signup" className="underline text-zinc-500 hover:text-zinc-700">Sign up</Link>
            </div>
            <form className="w-full flex flex-col items-center justify-center" onSubmit={handleSubmit}>
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
                    <button className="bg-black text-white rounded-md p-1 w-[350px]" type="submit">Sign in</button>
                </div>
                
            </form>
        </div>
    );
}
