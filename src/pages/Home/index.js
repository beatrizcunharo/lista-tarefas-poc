import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; //navegar de forma indireta
import './home.css' 

function Home() {
  const [email,setEmail] = useState("")
  const [senha,setSenha] = useState("")
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if(email !== "" && senha!== "") {
      await signInWithEmailAndPassword (auth, email, senha).then(() => { //Loga o usuário utilizando a autenticação por e-mail do firebase
        navigate('/admin', {replace: true})
      }).catch(error => {
        console.error("Erro ao fazer o login", error);
      })
    } else {
      alert("Preencha todos os campos!")
    }
  }

  return (
    <div className='home-container'>
      <h1>Lista de Tarefas</h1>
      <span>Gerencie sua agenda de forma fácil.</span>
      <form className='form' onSubmit={handleLogin}>
        <input placeholder='Digite seu e-mail...' type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input placeholder='***********' type='password' value={senha} onChange={(e) => setSenha(e.target.value)}/>
        <button type='submit'>Acessar</button>
      </form>
      <Link to="/register" className='button-link'> Não possui uma conta? Cadastre-se</Link>
    </div>
  );
}

export default Home;