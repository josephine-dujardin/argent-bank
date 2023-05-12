import { useLoginMutation, useProfileMutation } from "../services/auth.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LocalStorageKeys, StaticRoutes } from "../const/const";
import { updateToken } from "../store/authReducer";
import { authStore } from "../store/authStore";

const Login = () => {
    const [login] = useLoginMutation();
    const [profileRequest] = useProfileMutation();
    const [hasError, setHasError] = useState(false);
    const { register, handleSubmit } = useForm({ mode: "onTouched" });
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const user = await login(data);
            if (user.error?.status === 400) setHasError(true);
            if (user.data?.status === 200) {
                remember && localStorage.setItem(LocalStorageKeys.RememberUser, "true");
                localStorage.setItem(LocalStorageKeys.AuthToken, user.data.body.token);
                const profile = await profileRequest({});
                localStorage.setItem(
                    LocalStorageKeys.UserProfile,
                    JSON.stringify(profile.data?.body)
                );
                authStore.dispatch(updateToken(user.data.body.token));
                navigate(StaticRoutes.Profile);
            }
        } catch (err) {
            setHasError(true);
        }
    };

    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-wrapper">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: true })}
                        />
                    </div>
                    <div className="input-remember">
                        <input
                            type="checkbox"
                            id="remember-me"
                            onChange={() => setRemember(!remember)}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button className="sign-in-button">Sign In</button>
                </form>
                {hasError && (
                    <small className="error-message">
                        Email ou/et mot de passe incorrecte
                    </small>
                )}
            </section>
        </main>
    );
};

export default Login;
