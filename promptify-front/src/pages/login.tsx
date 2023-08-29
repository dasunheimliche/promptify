import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "@apollo/client";

import { LOGIN } from "@/queries";
import { Token } from "../types";

import style from "../styles/auth.module.css";

interface loginData {
  login: Token;
}

interface loginVariables {
  username: string;
  password: string;
}

const Login = () => {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user-token")
      : undefined;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(true);

  const router = useRouter();

  const [login, { data, loading }] = useMutation<loginData, loginVariables>(
    LOGIN,
    {
      onError: (error) => {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          setError(false);
          console.error(error.graphQLErrors[0].message);
        } else {
          setError(false);
          console.error("An unknown error occurred.");
        }
      },
    }
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const { data } = await login({ variables: { username, password } });
      if (!data) return;
      sessionStorage.setItem("user-token", data?.login.value);
      router.push("/me");
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  const demoSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault();
      const { data } = await login({
        variables: { username: "Horrorshow", password: "12345" },
      });
      if (!data) return;
      sessionStorage.setItem("user-token", data?.login.value);
      router.push("/me");
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  if (token) router.push("/me");

  return (
    <div className={style.main}>
      {(loading || data?.login.value) && <div className={style.loading}></div>}
      <div className={style["left-side"]}>
        <div className={style.card}>
          <div>Bienvenido/a</div>
          <div>Por favor ingrese sus datos</div>

          <form className={style.form} onSubmit={submit}>
            <input
              required
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              placeholder={"username"}
            />
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"password"}
            />

            {!error && <div className={style.failedLogin}></div>}

            <button type="submit" className="p">
              Log in
            </button>
            <button type="button" className="p" onClick={demoSubmit}>
              Demo
            </button>
          </form>

          <div className={style.toRegister}>
            <p>¿No tienes una cuenta?</p>
            <Link href={"/register"}>Regístrate gratis</Link>
          </div>
        </div>
      </div>

      <div className={style["right-side"]}></div>
    </div>
  );
};

export default Login;
