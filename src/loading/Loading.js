import react from "@vitejs/plugin-react-swc";
import { Spinner } from "reactstrap";
import './Loading.css'

function Loading(){
    return(
        <Spinner color="dark" />
    );
}

export default Loading;