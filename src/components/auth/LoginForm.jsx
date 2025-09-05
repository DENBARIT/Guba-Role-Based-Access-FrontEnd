
import React from 'react'
import { Form, Input, Button, Typography, Card } from 'antd'

const { Title } = Typography

export default function LoginForm({ onSubmit, loading = false }) {
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    // The backend expects { "Username": "...", "Password": "..." }.
    
    onSubmit({
      username: values.username, 
      password: values.password,
    })
  }

  return (
    <Card style={{ maxWidth: 420, margin: '0 auto' }}>
      <Title level={3}>Sign in</Title>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input placeholder="your-username" autoComplete="username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password placeholder="••••••••" autoComplete="current-password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Log in
        </Button>
      </Form>
    </Card>
  )
}
