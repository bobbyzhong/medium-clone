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

        return (
            date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
        );
    }

    return (
        <Card
            isPressable
            css={{ mb: "$10" }}
            onPress={() => router.push("/article?id=" + article.id)}
        >
            <Card.Body>
                <Text h3>{article.title}</Text>
                <Text>posted {getDate()}</Text>
                <Text>By {article.user_email.toLowerCase()}</Text>
            </Card.Body>
        </Card>
    );
};

export default ArticleCard;
