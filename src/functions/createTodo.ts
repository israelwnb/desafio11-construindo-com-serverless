import { document } from "../utils/dynamodbClient";
import {v4 as uuid} from "uuid";

interface ICreateTodo {
    title: string;
    deadline: string;
}

interface IRequest {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: string;
}

export const handle = async (event) => {
    const { user_id } = event.pathParameters;
    let { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    const id = uuid();

    const data: IRequest = {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toUTCString(),
    }

    await document.put({
        TableName: "todos",
        Item: data
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Created",
            data
        }),
        headers: {
            "Content-Type": "application/json",
        },
    };
};