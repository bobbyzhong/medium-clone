import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

//  localhost:3000/createArticle

const Onboard: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const initialState = {
        username: "",
        team: "",
    };

    const [userData, setUserData] = useState(initialState);

    const handleChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const createUser = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("users")
                .insert([
                    {
                        username: userData.username,
                        team: userData.team,
                        email: user?.email?.toLowerCase(),
                        user_id: user?.id,
                    },
                ])
                .single();
            if (error) throw error;
            setUserData(initialState);
            router.push("/mainFeed");
            // router.push("/profile?username=" + userData.username);
        } catch (error: any) {
            alert(error.message);
        }
    };

    console.log(userData);
    return (
        <div>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">Onboard Page</div>
                <div className="">
                    Once you finish setting up your profile and then you can
                    start posting!
                </div>
            </div>
            <Grid.Container gap={1}>
                <Text h3>Username</Text>
                <Grid xs={12}>
                    <Textarea
                        name="username"
                        aria-label="username"
                        placeholder="Username"
                        fullWidth={true}
                        rows={1}
                        size="xl"
                        onChange={handleChange}
                    ></Textarea>
                </Grid>
                <Text h3>Team You Support</Text>
                <Grid xs={12}>
                    <Textarea
                        name="team"
                        aria-label="team"
                        placeholder="FC Barcelona"
                        fullWidth={true}
                        rows={1}
                        size="xl"
                        onChange={handleChange}
                    ></Textarea>
                </Grid>

                <button onClick={createUser}>Done!</button>
            </Grid.Container>
        </div>
    );
};

export default Onboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    return {
        props: {
            initialSession: session,
            user: session.user,
        },
    };
};
