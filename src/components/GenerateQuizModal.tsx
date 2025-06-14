
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
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, BookOpen } from "lucide-react";

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
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
            Generate Quiz From Lesson
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We'll create a set of multiple choice questions based on the whole lesson content.
            <br />
            <span className="text-sm text-blue-600 font-medium">
              Optionally, enter extra topics or questions you'd like included.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Additional Topics (Optional)</label>
            <Textarea
              placeholder="Add extra topics or questions here (optional)..."
              value={userTopics}
              onChange={e => setUserTopics(e.target.value)}
              disabled={loading}
              rows={3}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {quiz && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-blue-200 pb-2">
              Generated Quiz Questions
            </h3>
            {quiz.map((q, i) => (
              <div key={i} className="p-4 rounded-lg border border-blue-200 bg-white/60 backdrop-blur-sm">
                <div className="font-semibold mb-3 text-gray-800">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                    Q{i + 1}
                  </span>
                  {q.question}
                </div>
                <ul className="space-y-2 mb-3">
                  {q.options.map((opt, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="w-6 h-6 rounded-full border-2 border-blue-300 flex items-center justify-center text-xs font-medium mr-3 text-blue-600">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                  <strong>Answer:</strong> {q.answer}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-300 hover:bg-gray-50">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateQuizModal;
