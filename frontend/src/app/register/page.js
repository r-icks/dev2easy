"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Checkbox, Select } from "antd";
import { useMutation } from "react-query";
import { register } from "@/services/auth.service";

export default function Home() {
  const router = useRouter();

  const onFinish = async (values) => {
    await registerMutation.mutateAsync(values);
  };

  const registerMutation = useMutation(register, {
    onSuccess: (data) => {
      console.log("data", data);
      message.success("Register Successful, please login to continue");
      router.push("/login");
    },
  });

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className="samarkan-text nav-logo">Suvidha</h1>
      </div>

      <div className={styles.center}>
        <div
          style={{
            fontSize: "2.6rem",
            fontWeight: "bold",
          }}
        >
          Register
        </div>
        <div
          style={{
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          Start your Journey with Suvidha for a better tomorrow
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input type="email" placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}
          >
            <Input placeholder="Enter your Age" />
          </Form.Item>

          <Form.Item
            label="Sex"
            name="sex"
            rules={[
              {
                required: true,
                message: "Please select your sex!",
              },
            ]}
          >
            <Select placeholder="Select your sex" allowClear>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[
              {
                required: true,
                message: "Please select your Account Type!",
              },
            ]}
          >
            <Select placeholder="Select your Account Type" allowClear>
              <Select.Option value="elder">I am an elder</Select.Option>
              <Select.Option value="caretaker">I am a caretaker</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginTop: "1rem",
                width: "100%",
              }}
              // size="large"
            >
              Signup
            </Button>
          </Form.Item>

          <p>
            Already have an account?{" "}
            <a
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </a>
          </p>
        </Form>
      </div>
    </main>
  );
}
