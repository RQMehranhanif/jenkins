import { notification } from "antd";
export const OpenNotification = (type: string, message: string) => {
  notification.config({ placement: "topRight" });

  if (type === "success") {
    notification.success({
      key: "Notification",
      message,
      style: { marginTop: 100 },
    });
  } else {
    notification.error({
      key: "Notification",
      message,
      style: { marginTop: 100 },
    });
  }

  setTimeout(() => undefined, 10000);
};
