import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const llm = new Ollama({
    baseUrl: "http://89.116.167.82:11434",
    model: "tinyllama", 
});

const embedding = new OllamaEmbeddings({
    baseUrl: "http://89.116.167.82:11434",
    model: "nomic-embed-text",
})
console.log('Ollama embeddings loaded', embedding.baseUrl);

// load json file and create a document
const loader = new JSONLoader("./assets/data.json");
const docs = await loader.load();
console.log('JSON loaded');

// store the document in the vector store
const vectorStore = await Chroma.fromDocuments(docs, embedding, {
    collectionName: "myLangchainCollection",
    url: "http://localhost:8000", // Optional, will default to this value
})
console.log('Document stored in vector store');

// search in vector store
const vectorSearch = await vectorStore.similaritySearch("what is the phone number of Nathan?", 1);
console.log(vectorSearch);

// const stream = await ollama.stream(`
//     This is database query output:
//     location: "New York"
//     date: "2021-01-01"
//     accidents: 100
//     deaths: 10

//     The question is:
//     How many accidents were there in New York on 2021-01-01?

    
// `);

// const chunks = []
// for await (const chunk of stream) {
//     chunks.push(chunk);
//     process.stdout.write(chunk);
// }
