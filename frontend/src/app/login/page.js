"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { login } from "@/services/auth.service";
import { useMutation } from "react-query";
export default function Home() {
  const router = useRouter();

  const onFinish = async (values) => {
    await loginMutation.mutateAsync(values);
  };

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      console.log("data", data);
      message.success("Login Successful");
      router.push("/dashboard");
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
          Login
        </div>
        <div
          style={{
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          because we care
        </div>
        <Form
          name="basic"
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
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
              Login
            </Button>
          </Form.Item>

          <p>
            Don&apos;t have an account?{" "}
            <a
              onClick={() => {
                router.push("/register");
              }}
            >
              Sign up
            </a>
          </p>
        </Form>
      </div>
    </main>
  );
}
