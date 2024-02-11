"use client";
import styles from "../../page.module.css";
import { useRouter } from "next/navigation";
import {
  Spin,
  Upload,
  Form,
  Input,
  Button,
  Select,
  TimePicker,
  message,
} from "antd";
import { useQuery } from "react-query";
import { getCurrentUser } from "@/services/auth.service";
import { GiBugleCall, GiFoldedPaper, GiThreeFriends } from "react-icons/gi";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

import { FaHome, FaUpload } from "react-icons/fa";
import { useEffect } from "react";
const { Dragger } = Upload;

const defaultMedicationGroup = {
  medicationGroups: [
    {
      time: moment("12:00", "HH:mm"), // Example default time
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
        },
      ],
      weekdays: ["Mo", "Tu"],
    },
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    // You can further process the data or directly use it to create a document in your database
  };

  useEffect(() => {
    form.setFieldsValue(defaultMedicationGroup);
  }, []);

  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // const registerMutation = useMutation(getCurrentUser, {
  //   onSuccess: (data) => {
  //     console.log("data", data);
  //     message.success("Register Successful, please login to continue");
  //     router.push("/login");
  //   },
  // });

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
            <FaHome className={styles.icon} size={84} />
            Dashboard
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
          Add Medication
        </h1>
        <p
          style={{
            fontSize: "14px",
          }}
        >
          Add your medication details here
        </p>

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <h1
            className={styles.dashboardHeader}
            style={{
              marginTop: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Prescription Upload
          </h1>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "1rem",
            }}
          >
            Uploading a prescription image will magically parse the details and
            add the medication to your timeline using the power of <b>LLMs</b>{" "}
            and <b>OCR</b>
          </p>

          <Dragger {...props}>
            <p className="ant-upload-drag-icon" style={{ margin: 0 }}>
              <FaUpload size={28} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports single image upload JPEG/PNG
            </p>
          </Dragger>
          <h2
            style={{
              textAlign: "center",
              fontWeight: 500,
              margin: "1rem 0",
            }}
          >
            OR
          </h2>
        </div>

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <h1
            className={styles.dashboardHeader}
            style={{
              marginTop: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Manual Entry
          </h1>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "1rem",
            }}
          >
            You can enter the details of the medication manually
          </p>
          <Form
            form={form}
            name="medication_groups_form"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.List name="medicationGroups">
              {(groupFields, { add: addGroup, remove: removeGroup }) => (
                <>
                  {groupFields.map(({ key, name, ...restGroupField }) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #964b00",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "20px",
                      }}
                    >
                      <h1
                        className={styles.dashboardHeader}
                        style={{
                          marginTop: "0",
                        }}
                      >
                        Medication Group {name + 1}
                      </h1>
                      <Form.Item
                        {...restGroupField}
                        name={[name, "time"]}
                        label="Time of intake of medication"
                        rules={[
                          { required: true, message: "Please select time!" },
                        ]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>

                      <Form.List name={[name, "medicines"]}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div
                                key={field.key}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 8,
                                }}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, "name"]}
                                  fieldKey={[field.fieldKey, "name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing medicine name",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Medicine Name" />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "dosage"]}
                                  fieldKey={[field.fieldKey, "dosage"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing dosage",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Dosage" />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Medicine
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>

                      <Form.Item
                        {...restGroupField}
                        name={[name, "weekdays"]}
                        label="What days is this medication for?"
                        rules={[
                          {
                            required: true,
                            message: "Please select weekdays!",
                          },
                        ]}
                      >
                        <Select mode="multiple" placeholder="Select weekdays">
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                            (day) => (
                              <Option key={day} value={day}>
                                {day}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>

                      <MinusCircleOutlined
                        onClick={() => removeGroup(name)}
                        style={{ color: "red", marginLeft: 8 }}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => addGroup()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Medication Group
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
