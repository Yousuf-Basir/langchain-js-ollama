import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CSVLoader } from "langchain/document_loaders/fs/csv";

const llm = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "tinyllama", 
});

const embedding = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text",
})
console.log('Ollama embeddings loaded', embedding.baseUrl);

// load json file and create a document
// const loader = new JSONLoader("./assets/data.json", [
//     "/name", "/specialty", "/location", "/phone", "/email"
// ]);
// const docs = await loader.load();
// console.log('JSON loaded');

// load csv file and create a document
const loader = new CSVLoader('./assets/data.csv');
const docs = await loader.load();

// store the document in the vector store
const vectorStore = await Chroma.fromDocuments(docs, embedding, {
    collectionName: "myLangchainCollection",
    url: "http://localhost:8000", // Optional, will default to this value
})
console.log('Document stored in vector store');

// search in vector store
const vectorSearch = await vectorStore.similaritySearch("what is the phone number of Nathan?", 1);
console.log(vectorSearch);

const stream = await llm.stream(`
    You will create a complete answer based on given question and its answer. 

    Question: What is the phone number of Nathan?
    Answer: +3880238331
`);

const chunks = []
for await (const chunk of stream) {
    chunks.push(chunk);
    process.stdout.write(chunk);
}
