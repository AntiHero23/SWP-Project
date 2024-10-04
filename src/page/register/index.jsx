import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import api from '../../config/axios'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Password and confirm password do not match')
      return
    }
    try {
      const response = await api.post('register', { username, password })
      alert('Register successfully')
    } catch (error) {
      alert('Register failed')
    }
  }

  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <Form.Item label="Username">
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>
      <Form.Item label="Password">
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <Form.Item label="Confirm Password">
        <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Register;
