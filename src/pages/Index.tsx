
import GenerateQuizModal from "@/components/GenerateQuizModal";
import Testimonials from "@/components/Testimonials";
import QuickStartTutorial from "@/components/QuickStartTutorial";
import RecentActivity from "@/components/RecentActivity";

const LESSON_CONTENT = `
# Introduction to Cellular Biology

## Cell Structure and Function

Cells are the fundamental units of life. All living organisms are composed of one or more cells, and the cell is the smallest unit that can be classified as a living thing.

### Key Components:
- **Cell Membrane**: Controls what enters and exits the cell
- **Nucleus**: Contains genetic material (DNA)
- **Cytoplasm**: Gel-like substance where cellular processes occur
- **Mitochondria**: Powerhouses that produce energy (ATP)

### Types of Cells:
1. **Prokaryotic**: No membrane-bound nucleus (bacteria)
2. **Eukaryotic**: Has membrane-bound nucleus (plants, animals, fungi)

This foundational knowledge forms the basis for understanding more complex biological processes like photosynthesis, cellular respiration, and genetic inheritance.
`;

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master Any Subject with AI-Powered Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Transform your study materials into personalized quizzes. Upload documents, get intelligent questions, and accelerate your learning with Scholar's AI assistant.
          </p>
        </div>

        {/* Quick Start Tutorial */}
        <QuickStartTutorial />

        {/* Sample Lesson Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="text-left p-6 rounded-xl border border-blue-200 bg-white/70 backdrop-blur-sm shadow-lg mb-8">
              <div className="font-semibold mb-3 text-lg text-blue-800 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Sample Lesson Content
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                {LESSON_CONTENT}
              </div>
              <div className="mt-6 flex justify-center">
                <GenerateQuizModal lessonContent={LESSON_CONTENT} />
              </div>
            </div>
          </div>
          
          {/* Recent Activity Sidebar */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Trusted by Learners Worldwide
          </h2>
          <Testimonials />
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning?</h3>
          <p className="text-blue-100 mb-6">Join thousands of students and educators using Scholar to enhance their educational experience.</p>
          <GenerateQuizModal 
            lessonContent={LESSON_CONTENT}
            triggerButtonProps={{
              className: "bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
            }}
            triggerText="Start Learning Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
