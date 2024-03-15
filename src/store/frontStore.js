import { createContext } from "react";
import Swal from "sweetalert2";

export const FrontData = createContext({});

export const messageAlert = (type, text) => {
  if (type === "success") {
    Swal.fire({
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: 1000,
    });
  } else if (type === "error") {
    Swal.fire({
      icon: "error",
      title: text,
      showConfirmButton: false,
      timer: 1000,
    });
  } else if (type === "warning") {
    Swal.fire({
      icon: "warning",
      title: text,
      showConfirmButton: false,
      timer: 1000,
    });
  }
};
