import { NextPage } from "next";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Card, Text } from "@nextui-org/react";

interface Props {
    article: any;
}

const ArticleCard: NextPage<Props> = (props) => {
    const { article } = props;
    const router = useRouter();

    function getDate() {
        //dd--mm--yyy
        let time = Date.parse(article.inserted_at);
        let date = new Date(time);
        let day = date.getDay();

        return (
            date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear()
        );
    }

    return (
        <Card
            isPressable
            css={{ mb: "$10" }}
            onPress={() => router.push("/article?id=" + article.id)}
        >
            <Card.Body>
                <div className="text-xl font-semibold mb-5">
                    {article.title}
                </div>
                <div className="mb-1">Posted {getDate()}</div>
                <div>by {article.username}</div>
            </Card.Body>
        </Card>
    );
};

export default ArticleCard;
