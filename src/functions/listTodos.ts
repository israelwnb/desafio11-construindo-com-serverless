import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;

    const response = await document.scan({
        TableName: 'todos',
        FilterExpression: ":user_id = user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id,
        },
    }).promise();

    const userTodos = response.Items;

    if (userTodos) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                userTodos,
            })
        }
    };

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "There are not todos for this user",
        })
    };
}