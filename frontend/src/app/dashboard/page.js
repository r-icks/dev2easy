"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { Collapse, Spin, List, Button, Select, message } from "antd";
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

  // const {
  //   data: medicineData,
  //   isLoading: medicineLoading,
  //   error,
  // } = useQuery(["get-medicines"], () => getMedicineInfo(currentUser?._id), {
  //   onSuccess: (data) => {
  //     console.log("medicine data", data);
  //   },
  //   enabled: !!currentUser?._id,
  // });

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
          Medication Timeline
        </h1>
        <p
          style={{
            fontSize: "14px",
          }}
        >
          View the next medication to take today
          <br />({new Date().toDateString()})
        </p>

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <Collapse defaultActiveKey={["1"]}>
            {medicineData?.medicineList?.map((medicine, index) => (
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
