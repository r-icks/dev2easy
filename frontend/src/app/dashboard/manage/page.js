"use client";
import styles from "../../page.module.css";
import { useRouter } from "next/navigation";
import {
  Collapse,
  Spin,
  List,
  Button,
  Select,
  message,
  Form,
  Input,
} from "antd";
import { useMutation, useQuery } from "react-query";
import {
  getAllUser,
  getCurrentUser,
  getMedicineInfo,
  logout,
  register,
} from "@/services/auth.service";
import {
  GiPill,
  GiBugleCall,
  GiFoldedPaper,
  GiThreeFriends,
} from "react-icons/gi";
import { useState } from "react";
const { Panel } = Collapse;
export default function Dashboard() {
  const router = useRouter();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await registerMutation.mutateAsync(values);
  };
  const [elders, setElders] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const listdata = [
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires.",
  ];

  const { data, isLoading } = useQuery(["get-current-user"], getCurrentUser, {
    onSuccess: async (data) => {
      console.log("data", data);
      if (data?.user?.accountType === "elder") {
        setCurrentUser(data?.user);
        await medicineGetMutation.mutateAsync(data?.user?._id);
      } else {
        await getElderMutation.mutateAsync();
      }
    },
  });

  const getElderMutation = useMutation(getAllUser, {
    onSuccess: (data) => {
      console.log("elder data", data);
      setElders(data.elders);
    },
  });

  const registerMutation = useMutation(register, {
    onSuccess: (data) => {
      console.log("data", data);
      message.success("Register Successful, please login to continue");
      router.push("/dashboard");
    },
  });
  const medicineGetMutation = useMutation(getMedicineInfo, {
    onSuccess: (data) => {
      console.log("medicine data", data);
      setMedicineData(data);
    },
  });

  if (isLoading) {
    return <Spin></Spin>;
  }

  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <main
        style={{
          textAlign: "center",
        }}
      >
        <div className={styles.description}>
          <h1 className="samarkan-text nav-logo">Suvidha</h1>
        </div>
      </main>
      <div className={styles.dashboard}>
        <h1 className={styles.dashboardHeader}>Welcome {data?.user?.name}</h1>
        <p
          style={{
            fontSize: "14px",
          }}
        >
          How are you feeling today?
        </p>

        {currentUser?.accountType === "caretaker" && (
          <Select
            placeholder="Select user to manage"
            allowClear
            style={{
              width: "100%",
              margin: "1rem 0",
            }}
            onSelect={async (value) => {
              console.log("selected", value);
              await medicineGetMutation.mutateAsync(value);
            }}
          >
            {elders?.map((elder) => (
              <Select.Option key={elder._id} value={elder._id}>
                {elder.name}
              </Select.Option>
            ))}
          </Select>
        )}

        <div className={styles.nav}>
          <div
            className={styles.navItem}
            onClick={() => {
              router.push("/dashboard/medicine");
            }}
          >
            <GiPill className={styles.icon} size={84} />
            Medicines
          </div>
          <div
            className={styles.navItem}
            onClick={() => window.open("tel:+918799771287")}
          >
            <GiBugleCall className={styles.icon} size={84} />
            <p>Contact</p>
          </div>
          <div className={styles.navItem}>
            <GiFoldedPaper className={styles.icon} size={84} />
            Reports
          </div>
          <div className={styles.navItem}>
            <GiThreeFriends className={styles.icon} size={84} />
            Community
          </div>
        </div>

        <h1
          className={styles.dashboardHeader}
          style={{
            marginTop: "2rem",
          }}
        >
          Manage Elders
        </h1>
        <p
          style={{
            fontSize: "14px",
          }}
        >
          You can manage the elders here
        </p>

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          {elders?.length === 0 && (
            <p
              style={{
                fontSize: "14px",
                marginBottom: "1rem",
              }}
            >
              No elders found
            </p>
          )}
          <Collapse defaultActiveKey={["1"]}>
            {elders?.map((medicine, index) => (
              <Panel
                key={index.toString()}
                header={
                  <>
                    <div className={styles.timelineTime}>{medicine.time}</div>
                    <div className={styles.timelineDescription}>
                      Take these medicines after lunch (
                      {medicine.medicines.length} medicines)
                    </div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        marginTop: "1rem",
                        fontSize: "0.8rem",
                        color: "#ffe17d",
                      }}
                    >
                      Log Medication
                    </Button>
                  </>
                }
              >
                <List
                  size="large"
                  bordered
                  dataSource={medicine.medicines}
                  renderItem={(item) => (
                    <List.Item>
                      {item.name} - {item.dosage}
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
      <h1
        className={styles.dashboardHeader}
        style={{
          marginTop: "2rem",
        }}
      >
        Add Elder Profile
      </h1>
      <p
        style={{
          fontSize: "14px",
        }}
      >
        You can register new elders here
      </p>
      <Form
        // name="basic"
        form={form}
        name="register-form"
        initialValues={{}}
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
          <Input.Password placeholder="Password" autoComplete="new-password" />
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

        {/* Add phone number field */}
        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
        >
          <Input placeholder="Enter your Phone Number" />
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
      <Button
        style={{
          background: "#CA0B00",
          borderRadius: "4px",
          color: "#fff",
          marginTop: "1rem",
        }}
        type="warning"
        onClick={async () => {
          await logout().then(() => {
            message.success("Logged out successfully");
            router.push("/login");
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
