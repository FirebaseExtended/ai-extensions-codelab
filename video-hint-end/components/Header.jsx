/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 "use client";

 import React, { useState, useEffect } from "react";
 import Link from "next/link";
 import {
	 signInWithGoogle,
	 signOut,
	 onAuthStateChanged,
 } from "@/lib/firebase/auth.js";
 import { useRouter } from "next/navigation";
 
 function useUserSession(initialUser) {
	 // The initialUser comes from the server via a server component
	 const [user, setUser] = useState(initialUser);
	 const router = useRouter()
 
	 useEffect(() => {
		 const unsubscribe = onAuthStateChanged((authUser) => {
			 setUser(authUser)
		 })
 
		 return () => unsubscribe()
		 // eslint-disable-next-line react-hooks/exhaustive-deps
	 }, [])
 
	 useEffect(() => {
		 onAuthStateChanged((authUser) => {
			 if (user === undefined) return
 
			 // refresh when user changed to ease testing
			 if (user?.email !== authUser?.email) {
				 router.refresh()
			 }
		 })
		 // eslint-disable-next-line react-hooks/exhaustive-deps
	 }, [user])
	
	 return user;
 }
 
 export default function Header({ initialUser }) {
	 const user = useUserSession(initialUser);
	 const router = useRouter();
	 const handleSignOut = event => {
		 event.preventDefault();
		 signOut();
		 router.push("/");
		 router.refresh();
	 };
 
	 const handleSignIn = event => {
		 event.preventDefault();
		 signInWithGoogle();
	 };
 
	 return (
		 <header>
			 <Link href="/" className="logo">
			 	Video Hint
			 </Link>
			 {user ? (
				 <>
					 <div className="profile">
						 <p>
							 <img src="/profile.svg" alt={user.email} />
							 {user.displayName}
						 </p>
 
						 <div className="menu">
							 ...
							 <ul>
								 <li>{user.displayName}</li>
 
								 <li>
									 <a href="#" onClick={handleSignOut}>
										 Sign Out
									 </a>
								 </li>
							 </ul>
						 </div>
					 </div>
				 </>
			 ) : (
				 <a href="#" onClick={handleSignIn}>
					 Sign In with Google
				 </a>
			 )}
		 </header>
	 );
 }
 