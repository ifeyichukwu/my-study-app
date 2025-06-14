
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

// Simulate quiz generation -- replace with backend call to Supabase edge function.
async function generateQuiz({
  lessonContent,
  userTopics,
}: {
  lessonContent: string;
  userTopics: string;
}): Promise<QuizQuestion[]> {
  // TODO: Integrate with Supabase Edge Function that calls OpenAI with your key.
  // For now, returns mock data.
  const topics = userTopics ? ` and also covering: ${userTopics}` : "";
  return [
    {
      question: `Which topic is covered in this lesson${topics}?`,
      options: ["Topic A", "Topic B", "Topic C", "Topic D"],
      answer: "Topic A",
    },
    {
      question: "What is the main takeaway from the lesson?",
      options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
      ],
      answer: "Option 2",
    },
  ];
}

interface GenerateQuizModalProps {
  lessonContent: string;
}

const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({ lessonContent }) => {
  const [open, setOpen] = useState(false);
  const [userTopics, setUserTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    try {
      const result = await generateQuiz({ lessonContent, userTopics });
      setQuiz(result);
    } catch (err) {
      setError("Failed to generate quiz. Please try again!");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Generate Quiz</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Quiz From Lesson</DialogTitle>
          <DialogDescription>
            We’ll create a set of multiple choice questions based on the whole lesson content.
            <br />
            <span className="text-xs text-muted-foreground">
              Optionally, enter extra topics or questions you’d like included.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Textarea
            placeholder="Add extra topics or questions here (optional)..."
            value={userTopics}
            onChange={e => setUserTopics(e.target.value)}
            disabled={loading}
            rows={2}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {quiz && (
          <div className="mt-4 space-y-4">
            {quiz.map((q, i) => (
              <div key={i} className="p-3 rounded border bg-muted">
                <div className="font-semibold mb-2">{i + 1}. {q.question}</div>
                <ul className="space-y-1">
                  {q.options.map((opt, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-2">•</span>
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-green-700 mt-2">Answer: {q.answer}</div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateQuizModal;

