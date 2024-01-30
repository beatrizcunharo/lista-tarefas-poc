import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom"; 

// TRANSFORMAR A NAVEGAÇÃO COMO PRIVADA, VERIFICANDO SE UM USUÁRIO ESTÁ AUTENTICADO

function Private ({children}) {
    const [loading, setLoading] = useState(true)
    const [logado, setLogado] = useState(true)

    useEffect(() => {
        async function checkLogin () {
            onAuthStateChanged(auth, (user) => { //parecido com o onSnapshot, monitora os usuários em tempo real
                // Se tem usuário logado
                if(user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    }

                    sessionStorage.setItem("@detailUser", JSON.stringify(userData)) // utilizado para não ficar gravado por muito tempo no armazenamento do navegador
                    setLoading(false)
                    setLogado(true);
                } else {
                    // Não possui usuário logado
                    setLoading(false);
                    setLogado(false);
                }
            })
        }

        checkLogin()
    }, [])

    if(loading) {
        return (
            <div></div>
        )
    }

    if(!logado) {
        return <Navigate to="/"/>
    }

    return children;
}

export default Private;