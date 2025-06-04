"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
// Load environment variables
dotenv.config();
const API_KEY = process.env.GOOGLE_GENAI_API_KEY || "your-api-key-here";
const BASE_URL = "https://genai.googleapis.com";
const { GoogleGenAI } = require("@google/genai");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const client = new GoogleGenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
});
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({ message: "❌ Prompt is required" });
            return;
        }
        const systemPrompt = `
        You are a JSON response generator. Your task is to return ONLY a JSON object in this format:
  { "projectType": "react" } or { "projectType": "node" }.
  Do NOT include any explanations, code, or extra text. Your response must be valid JSON.
    `;
        const response = yield client.chat.completions.create({
            model: "genai-model",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            max_tokens: 8000,
            response_format: { type: "json_object" },
        });
        const messageContent = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            console.error("❌ AI returned empty response.");
            res.status(400).json({ message: "❌ AI response is empty" });
            return;
        }
        let projectType;
        try {
            const parsedContent = JSON.parse(messageContent);
            if (!parsedContent.projectType) {
                throw new Error("Missing 'projectType' in AI response");
            }
            projectType = parsedContent.projectType;
        }
        catch (parseError) {
            console.error("❌ Error parsing AI response:", parseError);
            res.status(400).json({ message: "❌ AI response is not in valid JSON format", rawResponse: response });
            return;
        }
        if (projectType === "react") {
            res.json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is a react artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
            return;
        }
        if (projectType === "node") {
            res.json({
                prompts: [
                    `Here is a node artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
            return;
        }
        res.status(403).json({ message: "❌ You can't access this" });
    }
    catch (error) {
        console.error("❌ Error:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({ message: "❌ Messages array is required and must be non-empty" });
            return;
        }
        const systemPrompt = (0, prompts_1.getSystemPrompt)();
        const chatMessages = [
            { role: "system", content: systemPrompt },
            ...messages
        ];
        const response = yield client.chat.completions.create({
            model: "genai-model",
            messages: chatMessages,
            max_tokens: 8000,
        });
        const messageContent = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!messageContent) {
            res.status(400).json({ message: "❌ AI response is empty" });
            return;
        }
        res.json({ message: messageContent });
    }
    catch (error) {
        console.error("❌ Error:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
}));
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
