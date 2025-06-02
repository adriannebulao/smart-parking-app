import Form from "../../components/Form";

function AdminLogin() {
  return <Form route="/api/users/login/" method={"login"} userType="admin" />;
}

export default AdminLogin;
