import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes'
import { useNavigate } from 'react-router-dom';
import assets2 from '../assets/assets2.jpg'


function SignUp() {
  const navigate = useNavigate()

 

  const handleSignUp = async(e)=>{
    e.preventDefault()
    try {
      let formData = new FormData(e.target)
      let data = Object.fromEntries(formData)
      
      if(data.email && data.password && data.name)
      {
        let res = await AxiosService.post(ApiRoutes.SIGNUP.path,data,{
          authenticate:ApiRoutes.SIGNUP.authenticate
        })

        if(res.status===201)
        {
          toast.success(res.data.message)
          navigate('/login')
        }
      }
      else
      {
        toast.error("Input Name, Email and Password")
      }

    } catch (error) {
        toast.error(error.response.data.message || error.message)
    }
  }
  return <>

  <img src={assets2} alt="Asset"></img>

  <div className='loginWrapper'>
    <div className='loginHeader'>
      <h2>SignUp</h2>
      <p>Already Have an account? <Link to='/login'>Login</Link></p>
    </div>
  <Form onSubmit={handleSignUp}>
      <Form.Group className="mb-3" >
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Name" name='name'/>
      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Company Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Company Name" name='companyName'/>
      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name='email'/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name='password'/>
      </Form.Group>
      
      <Button className='button' variant="primary" type="submit">
        SignUp
      </Button>
    </Form>
  </div>
  </>
}

export default SignUp