import { useState, useEffect } from 'react'
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import { addDoc, 
    collection, 
    onSnapshot, 
    query, 
    orderBy, 
    where,
    deleteDoc,
    doc,
    updateDoc
 } from 'firebase/firestore';
import './admin.css'

function Admin () {
    const [tarefaInput, setTarefaInput] = useState("")
    const [user, setUser] = useState({})
    const [tarefas, setTarefas] = useState([])
    const [edit, setEdit] = useState({})

    /**
   * Com o getDoc, nós que especificamos o doc que queremos buscar.
   * O getDocs traz todos os documentos de uma coleção
   */

    // const postRef = doc(db,"posts", "C4rvmfj1qK8OM2ARFnoc");

    // await getDoc(postRef).then((snapshot) => {
    //   alert("DOCUMENTO BUSCADO COM SUCESSO");
    //   setAutor(snapshot.data().autor);
    //   setTitulo(snapshot.data().titulo);
    // }).catch((error) => {
    //   console.error(error);
    // })

    // const postRef = collection(db,"posts");
    // await getDocs(postRef).then((snapshot) => {
    //     alert("DADOS BUSCADOS");
    //     let lista = []
    //     snapshot.forEach((doc) => {
    //       lista.push({
    //         id: doc.id,
    //         titulo: doc.data().titulo,
    //         autor: doc.data().autor
    //       });
    //     })
    //     setPosts(lista);
    //   }).catch((error) => {
    //     console.error(error);
    //   })

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = sessionStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if(userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==" , data?.uid)) // Faz uma query no banco 
                onSnapshot(q, (snapshot) => { // monitora o banco de dados em tempo real (cuidado porque pode pesar a aplicação porque monitora em tempo real. Qualquer atualização via web ou na aplicação, esta função irá captar e atualizar)
                    let lista = []
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setTarefas(lista)
                })
            }
        }

        loadTarefas();
    }, [])

    async function handleRegister(e) {
        e.preventDefault();
        if(tarefaInput === "") {
            alert("Digite sua tarefa");
            return ;
        }

        if(edit?.id) {
            handleUpdateTarefa();
            return ;
        }

        /**
         * Com o setDoc, nós que especificamos o doc que queremos criar.
         * O addDoc é como se tivesse clicando no autoId (gera um id aleatório e único)
         */

            // await setDoc(doc(db, "posts","12345"), { //cadastrar um novo documento
            //   titulo: titulo,
            //   autor: autor
            // }).then(() => {
            //   alert("DADOS CADASTRADOS");
            //   setAutor("");
            //   setTitulo("");
            // }).catch((error) => {
            //   console.error(error);
            // })

        await addDoc(collection(db, "tarefas"), { //addDoc cria um documento dentro da coleção tarefas com um id aleatório
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        }).then(() => {
            setTarefaInput("");
            alert("Tarefa registrada")
        }).catch(error => {
            console.error("Error ao registar", error)
        }) 

    }

    async function handleLogout () {
        await signOut(auth).then(() => { // Desloga o usuário (função padrão para deslogar)
            alert("Deslogado com sucesso.")
        }).catch(error => {
            console.error("Erro ao deslogar", error)
        })
    }

    async function deleteTarefa (id) {
        const docRef = doc(db, "tarefas", id);
        await deleteDoc(docRef).then(() => { // Deletar doc
            alert("Tarefa deletada com sucesso.")
        }).catch(error => {
            console.error("Erro ao deletar tarefa", error)
        })
    }

    async function editarTarefa (item) {
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa () {
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, { // Atualizar doc
            tarefa: tarefaInput,
        }).then(() => {
            setTarefaInput("")
            setEdit({})
            alert("Tarefa atualizada com sucesso")
        }).catch(error => {
            console.error("Erro ao atualizar", error)
            setTarefaInput("")
            setEdit({})
        })
    }

    return (
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>
            <form className="form" onSubmit={handleRegister}>
                <textarea placeholder='Digite sua tarefa...' value={tarefaInput} onChange={(e) => setTarefaInput(e.target.value)}/>
                <button className='btn-register' type='submit'>{Object.keys(edit).length > 0 ? "Atualizar tarefa" : "Registar tarefa"}</button> 
                {/* Object.keys verifica algo sobre o objeto. Na utilização em questão, é se o objeto é vazio */}
            </form>
            {tarefas.map((item) => {
                return (
                    <article className='list' key={item.id}>
                        <p>{item.tarefa}</p>
                        <div>
                            <button onClick={() => editarTarefa(item)}>Editar</button>
                            <button onClick={() => deleteTarefa(item.id)} className='btn-delete'>Concluir</button>
                        </div>
                    </article>
                )
            })}
            
            <button className='btn-logout' onClick={handleLogout}>Sair</button>

        </div>
    )
}

export default Admin