import GenerateQuizModal from "@/components/GenerateQuizModal";

const LESSON_CONTENT = `
Welcome to Your Blank App!

This is your lesson content. Replace this with your real lesson data.
You can generate a quiz based on this content, plus any extra topics you wish.
`;

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Your Learning App
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Start your learning journey and generate custom quizzes!
        </p>
        
        <div className="mb-8 text-left p-6 rounded-xl border border-blue-200 bg-white/70 backdrop-blur-sm shadow-lg">
          <div className="font-semibold mb-3 text-lg text-blue-800 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Lesson Content
          </div>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {LESSON_CONTENT}
          </div>
        </div>
        
        <div className="flex justify-center">
          <GenerateQuizModal lessonContent={LESSON_CONTENT} />
        </div>
      </div>
    </div>
  );
};

export default Index;
