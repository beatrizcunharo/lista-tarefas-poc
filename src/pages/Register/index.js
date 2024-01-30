import { useState } from 'react';
import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
  const [email,setEmail] = useState("")
  const [senha,setSenha] = useState("")
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if(email !== "" && senha!== "") {
      await createUserWithEmailAndPassword(auth, email, senha).then(() => { // Cria um novo usuário utilizando a autenticação por e-mail do firebase
        navigate("/admin", {replace: true})
      }).catch(error => {
        console.error("Erro ao cadastrar", error);
      })
    } else {
      alert("Preencha todos os campos!")
    }
  }

  return (
    <div className='home-container'>
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta.</span>
      <form className='form' onSubmit={handleRegister}>
        <input placeholder='Digite seu e-mail...' type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input placeholder='***********' type='password' value={senha} onChange={(e) => setSenha(e.target.value)}/>
        <button type='submit'>Cadastrar</button>
      </form>
      <Link to="/" className='button-link'> Já possui uma conta? Faça o login.</Link>
    </div>
  );
}

export default Register;