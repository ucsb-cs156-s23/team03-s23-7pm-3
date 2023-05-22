import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/icecreamshops",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}