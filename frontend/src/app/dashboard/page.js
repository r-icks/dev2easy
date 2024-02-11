"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { Collapse, Spin, List, Button } from "antd";
import { useMutation, useQuery } from "react-query";
import { getCurrentUser, register } from "@/services/auth.service";
import {
  GiPill,
  GiBugleCall,
  GiFoldedPaper,
  GiThreeFriends,
} from "react-icons/gi";
const { Panel } = Collapse;
export default function Dashboard() {
  const router = useRouter();
  const onFinish = async (values) => {
    await registerMutation.mutateAsync(values);
  };

  // const registerMutation = useMutation(getCurrentUser, {
  //   onSuccess: (data) => {
  //     console.log("data", data);
  //     message.success("Register Successful, please login to continue");
  //     router.push("/login");
  //   },
  // });
  const listdata = [
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires.",
  ];

  const { data, isLoading } = useQuery(["get-current-user"], getCurrentUser, {
    onSuccess: (data) => {
      console.log("data", data);
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
        <div className={styles.nav}>
          <div className={styles.navItem}>
            <GiPill className={styles.icon} size={84} />
            Medicines
          </div>
          <div className={styles.navItem}>
            <GiBugleCall className={styles.icon} size={84} />
            Contact
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
            <Panel
              header={
                <>
                  <div className={styles.timelineTime}>4:40 PM</div>
                  <div className={styles.timelineDescription}>
                    Take these medicines after lunch (12 medicines)
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
              key="1"
            >
              <List
                size="large"
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={listdata}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
}