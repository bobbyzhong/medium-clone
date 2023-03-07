import { Navbar, Button, Text } from "@nextui-org/react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

const NavbarComponent = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const userid = user?.id;

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push("/");
    }
    const initialState = {
        username: "",
        user_id: "",
    };
    const [userData, setUserData] = useState(initialState);

    useEffect(() => {
        async function getUserid() {
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
        }
        if (typeof userid != "undefined") {
            getUserid();
        }
    }, [userid]);

    return (
        <Navbar isBordered variant="floating">
            <Link className="text-xl font-medium tracking-wide" href={"/"}>
                Tifo Talk
            </Link>

            <Navbar.Content hideIn="xs" variant="highlight-rounded">
                <Navbar.Link href="/mainFeed">Main Feed</Navbar.Link>
                <Navbar.Link href="/createArticle">Create Article</Navbar.Link>
                {!user ? (
                    ""
                ) : (
                    // <Navbar.Link href={`"/profile?id=" + ${userData.username}`}>
                    //     Profile
                    // </Navbar.Link>
                    <button
                        onClick={() =>
                            router.push("/profile?userid=" + userData.user_id)
                        }
                    >
                        Profile
                    </button>
                )}
            </Navbar.Content>

            <Navbar.Content>
                {!user ? (
                    <>
                        <Navbar.Link href="/login">
                            <Button auto flat>
                                Login
                            </Button>
                        </Navbar.Link>
                    </>
                ) : (
                    <>
                        <Navbar.Item>
                            <Text>Hey, {userData.username}</Text>
                        </Navbar.Item>
                        <Navbar.Item>
                            <Button auto flat onPress={() => signOutUser()}>
                                Sign Out
                            </Button>
                        </Navbar.Item>
                    </>
                )}
            </Navbar.Content>
        </Navbar>
    );
};

export default NavbarComponent;
