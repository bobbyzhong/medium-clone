import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import {
    createServerSupabaseClient,
    User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";

//  localhost:3000/profile?username=[username]

const Profile: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const { userid } = router.query;

    const initialState = {
        username: "",
        team: "",
    };
    const [userData, setUserData] = useState(initialState);

    const handleChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        async function getUser() {
            const { data, error }: { data: any; error: any } =
                await supabaseClient
                    .from("users")
                    .select("*")
                    .eq("user_id", userid)
                    .single();
            if (error) {
                console.log(error);
            } else {
                setUserData(data);
            }
            if (data == null) {
                router.push("/onboard");
            }
        }
        if (typeof userid != "undefined") {
            getUser();
        }
    }, [userid]);

    const editUser = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("users")
                .update([
                    {
                        username: userData.username,
                        team: userData.team,
                    },
                ])
                .eq("user_id", userid);
            if (error) {
                throw error;
            } else {
                alert("Successfully Updated!");
            }
            router.push("/profile?userid=" + user?.id);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
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
                    initialValue={userData.username}
                ></Textarea>
            </Grid>
            <Text h3>Your Team</Text>
            <Grid xs={12}>
                <Textarea
                    name="team"
                    aria-label="username"
                    placeholder="Team"
                    fullWidth={true}
                    rows={1}
                    size="xl"
                    onChange={handleChange}
                    initialValue={userData.team}
                ></Textarea>
            </Grid>
            <Grid xs={12}>
                <Text>Editing as {user?.email}</Text>
            </Grid>
            <button onClick={editUser}>Save</button>
        </Grid.Container>
    );
};

export default Profile;

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
