// Update this page (the content is just a fallback if you fail to update the page)

import GenerateQuizModal from "@/components/GenerateQuizModal";

const LESSON_CONTENT = `
Welcome to Your Blank App!

This is your lesson content. Replace this with your real lesson data.
You can generate a quiz based on this content, plus any extra topics you wish.
`;

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Start building your amazing project here!
        </p>
        <div className="mb-8 text-left p-4 rounded border bg-muted">
          <div className="font-semibold mb-2">Lesson Content</div>
          <div className="whitespace-pre-wrap">{LESSON_CONTENT}</div>
        </div>
        <GenerateQuizModal lessonContent={LESSON_CONTENT} />
      </div>
    </div>
  );
};

export default Index;
