import React, { useEffect, useState } from 'react'
import { auth, clearGoogleUserData } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        });

        return () => {
            listen();
        }
    }, []);
    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful')
            /* clear user data from localStorage, clearGoogleUserData() in firebase.js */
            clearGoogleUserData();

        }).catch(error => console.log(error))
    }
    return (
        // could input message like "Sign Out, in between the p tags"
        // <div>{ authUser ? <><p>{`Signed In as ${authUser.email}`}</p><button onClick={userSignOut}>Sign Out</button></> : <p></p> }</div>
        //{ authUser ? :  }
        <p></p>
    )
}

export default AuthDetails