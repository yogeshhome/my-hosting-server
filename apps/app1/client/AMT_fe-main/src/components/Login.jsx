import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import asset from '../assets/asset.png'
import AxiosService from '../utils/AxiosService'
import  ApiRoutes from '../utils/ApiRoutes'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate()

  useEffect(()=>{ 
    sessionStorage.clear()
  },[])

  const handleLogin = async(e)=>{
    e.preventDefault()
    try {
      let formData = new FormData(e.target)
      let data = Object.fromEntries(formData)

      if(data.email && data.password){
        let res = await AxiosService.post(ApiRoutes.LOGIN.path,data,{
          authenticate:ApiRoutes.LOGIN.authenticate
        })

        if(res.status===200)
        {
          sessionStorage.setItem('token',res.data.token)
          sessionStorage.setItem('role',res.data.role)
          sessionStorage.setItem('name',res.data.name)
          sessionStorage.setItem('userId',res.data.id)
          sessionStorage.setItem('company_name',res.data.cp_name)
          toast.success(res.data.message) 
          if(res.data.role==='admin')
            navigate('/admindashboard')
          else
            navigate('/inventory')
        }
      }
      else
      {
        toast.error("Input Email and Password")
      }

    } catch (error) {
        toast.error(error.response.data.message || error.message)
    }
  }

  return <>
    
      <img src={asset} alt="Asset"></img>

      <div className='loginWrapper'>
        <div className='loginHeader'>
          <h2>Login</h2>
          <p>Don't have an account? <Link to='/signup'>SignUp</Link></p>
        </div>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name='email' />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name='password' />
          </Form.Group>

          <Button className='button' variant="primary" type="submit">
            Login
          </Button>
        </Form>

      </div>
    
  </>
}

export default Login