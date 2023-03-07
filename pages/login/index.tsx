import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    if (user) {
        router.push("/profile?userid=" + user?.id);
    }
    return (
        <Auth
            appearance={{
                theme: ThemeSupa,
                style: {
                    button: {
                        background: "#22BF90",
                        color: "white",
                        fontFamily: "Outfit",
                    },
                    //..
                },
            }}
            supabaseClient={supabaseClient}
            providers={[]}
        />
    );
};

export default Login;
