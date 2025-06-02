import Form from "../../components/Form";

function UserLogin() {
  return <Form route="/api/users/login/" method={"login"} userType="user" />;
}

export default UserLogin;
