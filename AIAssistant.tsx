import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Brain, ClipboardCopy, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAssistant() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const callGPT = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      const result = data.response || "No response from AI.";
      setAIResponse(result);
      setHistory(prev => [...prev, { prompt: userInput, response: result }]);
    } catch (error) {
      setAIResponse("An error occurred while calling GPT.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse);
  };

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        AI Assistant
      </motion.h1>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardContent className="space-y-4 p-4">
              <Textarea
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button onClick={callGPT} disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Thinking..." : "Send"}
                </Button>
                <Button variant="outline" onClick={() => setUserInput("")}>Clear</Button>
              </div>
              {aiResponse && (
                <div className="mt-4">
                  <h2 className="font-semibold mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" /> Response
                    <ClipboardCopy
                      onClick={copyToClipboard}
                      className="w-4 h-4 ml-auto cursor-pointer hover:text-blue-500"
                    />
                  </h2>
                  <p className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md">
                    {aiResponse}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold mb-2">How to Use</h2>
              <ul className="list-disc list-inside">
                <li>Type your question or prompt in the box above.</li>
                <li>Click "Send" to get an AI-generated response.</li>
                <li>Use the copy button to reuse the response anywhere.</li>
              </ul>
              <Badge variant="secondary" className="mt-4">
                Powered by GPT-4
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Chat History
              </h2>
              {history.length === 0 ? (
                <p className="text-gray-500">No history yet.</p>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="border p-3 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-600 mb-1"><strong>Prompt:</strong> {item.prompt}</p>
                    <p className="text-sm"><strong>Response:</strong> {item.response}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
