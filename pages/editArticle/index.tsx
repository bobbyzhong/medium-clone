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

//  localhost:3000/editArticle?id=1

const EditArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const { id } = router.query;

    const initialState = {
        title: "",
        content: "",
    };
    const [articleData, setArticleData] = useState(initialState);

    const handleChange = (e: any) => {
        setArticleData({ ...articleData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        async function getArticle() {
            const { data, error }: { data: any; error: any } =
                await supabaseClient
                    .from("articles")
                    .select("*")
                    .filter("id", "eq", id)
                    .single();
            if (error) {
                console.log(error);
            } else {
                setArticleData(data);
            }
        }
        if (typeof id != "undefined") {
            getArticle();
        }
    }, [id]);

    const editArticle = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("articles")
                .update([
                    {
                        title: articleData.title,
                        content: articleData.content,
                    },
                ])
                .eq("id", id);
            if (error) throw error;
            router.push("/article?id=" + id);
        } catch (error: any) {
            alert(error.message);
        }
    };

    console.log(articleData);
    return (
        <Grid.Container gap={1}>
            <Text h3>Title</Text>
            <Grid xs={12}>
                <Textarea
                    name="title"
                    aria-label="title"
                    placeholder="Article Title"
                    fullWidth={true}
                    rows={1}
                    size="xl"
                    onChange={handleChange}
                    initialValue={articleData.title}
                ></Textarea>
            </Grid>
            <Text h3>Article Text</Text>
            <Grid xs={12}>
                <Textarea
                    name="content"
                    aria-label="content"
                    placeholder="Article Text"
                    fullWidth={true}
                    rows={6}
                    size="xl"
                    onChange={handleChange}
                    initialValue={articleData.content}
                ></Textarea>
            </Grid>
            <Grid xs={12}>
                <Text>Editing as {user?.email}</Text>
            </Grid>
            <Button onPress={editArticle}>Update Article</Button>
        </Grid.Container>
    );
};

export default EditArticle;

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
