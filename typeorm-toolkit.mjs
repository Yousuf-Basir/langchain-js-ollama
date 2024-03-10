import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";
import { createInterface } from "readline";
import { Ollama } from "@langchain/community/llms/ollama";

const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const llm = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "qwen", 
});

export const run = async () => {
    const datasource = new DataSource({
        type: "sqlite",
        database: "assets/chinook.db",
    });
    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });
    const model = llm;
    const toolkit = new SqlToolkit(db, model);
    const executor = createSqlAgent(model, toolkit);
    console.log("Successfully connected to the database")

    while (true) {
        // const input = `List the total sales per country. Which country's customers spent the most?`;
        // read input from console
        const input = await new Promise((resolve) => {
            readLine.question("Enter your question: ", (input) => {
                resolve(input);
            });
        });

        if (input === "exit") {
            await datasource.destroy();
            break;
        }


        console.log(`Executing with input "${input}"...`);

        const result = await executor.invoke({ input });

        console.log(`Got output ${result.output}`);
    }
};


run();