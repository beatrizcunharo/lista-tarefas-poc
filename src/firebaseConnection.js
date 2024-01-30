import { initializeApp } from 'firebase/app' //inicializa a aplicação
import { getFirestore } from 'firebase/firestore' //permite a conexão com o banco
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAulIz07B-THFfJ0udvwpcmkXyqva4Siqs",
    authDomain: "lista-tarefas-poc.firebaseapp.com",
    projectId: "lista-tarefas-poc",
    storageBucket: "lista-tarefas-poc.appspot.com",
    messagingSenderId: "349207743048",
    appId: "1:349207743048:web:2d676bb2264a4bdedd267d",
    measurementId: "G-SZ065WT6ZV"
};

const firebaseApp = initializeApp(firebaseConfig); //inicializa 

const db = getFirestore(firebaseApp); //conectando com o firestore passando a configuração do app

const auth = getAuth(firebaseApp);

export { db, auth }; //ou export const db ...

