import { createContext } from "react";
import Swal from 'sweetalert2';

export const FrontData = createContext({});

export const successAlert = (text)=>{
    Swal.fire({
        icon: "success",
        title: text,
        showConfirmButton: false,
        timer: 1000
      });
}