import { Routes, Route } from 'react-router-dom';
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"

function RouterHandler() {
    return (
        <Routes>
            <Route path="/auth">
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />
            </Route>
        </Routes>
    );
}

export default RouterHandler;