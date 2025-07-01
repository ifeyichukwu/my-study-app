
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, ChevronDown, ChevronUp, Plus, Link2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import UploadDocumentModal from '@/components/UploadDocumentModal';

// Enhanced data structure for cross-course linking
const initialDocuments = [
  {
    id: 1,
    title: "DS & A for University Beginners",
    author: "Thomas H. Cormen",
    uploadDate: "2024-06-10",
    fileSize: "3.2 MB",
    pages: 189,
    courses: ["ECE 319"],
  },
  {
    id: 2,
    title: "Advanced Algorithms Handbook",
    author: "Robert Sedgewick",
    uploadDate: "2024-06-08",
    fileSize: "2.8 MB",
    pages: 245,
    courses: ["ECE 319", "CS 101"], // Cross-linked document
  },
  {
    id: 3,
    title: "Electronic Transmission Fundamentals",
    author: "R.K Bjunder",
    uploadDate: "2024-06-12",
    fileSize: "2.4 MB",
    pages: 245,
    courses: ["ECE 320"],
  },
  {
    id: 4,
    title: "Network Protocols Guide",
    author: "A.S Tanenbaum",
    uploadDate: "2024-06-08",
    fileSize: "1.8 MB",
    pages: 156,
    courses: ["CS 101"],
  },
  {
    id: 5,
    title: "TCP/IP Protocol Suite",
    author: "Behrouz A. Forouzan",
    uploadDate: "2024-06-05",
    fileSize: "4.1 MB",
    pages: 312,
    courses: ["CS 101", "ECE 320"], // Cross-linked document
  },
];

const initialCourses = [
  {
    courseCode: "ECE 319",
    courseName: "Data Structures and Algorithms",
  },
  {
    courseCode: "ECE 320", 
    courseName: "Introduction to Electronic Transmission",
  },
  {
    courseCode: "CS 101",
    courseName: "Computer Networks",
  },
];

const Library = () => {
  const [openShelves, setOpenShelves] = useState<string[]>([]);
  const [documents, setDocuments] = useState(initialDocuments);
  const [courses] = useState(initialCourses);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Generate library data from documents and courses
  const libraryData = useMemo(() => {
    return courses.map(course => ({
      ...course,
      documents: documents.filter(doc => doc.courses.includes(course.courseCode))
    }));
  }, [documents, courses]);

  const toggleShelf = (courseCode: string) => {
    setOpenShelves(prev => 
      prev.includes(courseCode) 
        ? prev.filter(code => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const handleDocumentUploaded = (newDocument: any) => {
    const courseCode = newDocument.courseCode;
    
    if (courseCode) {
      const newDoc = {
        ...newDocument,
        id: Date.now(),
        courses: [courseCode]
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const toggleDocumentCourse = (docId: number, courseCode: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const courses = doc.courses.includes(courseCode)
          ? doc.courses.filter(c => c !== courseCode)
          : [...doc.courses, courseCode];
        return { ...doc, courses };
      }
      return doc;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Study Library
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Browse your documents organized by course shelves
          </p>
          
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload to Library
          </Button>
        </div>

        <div className="space-y-6">
          {libraryData.map((shelf) => (
            <Card key={shelf.courseCode} className="bg-white/70 backdrop-blur-sm border-blue-200">
              <Collapsible 
                open={openShelves.includes(shelf.courseCode)}
                onOpenChange={() => toggleShelf(shelf.courseCode)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {shelf.courseCode} - {shelf.courseName}
                          </CardTitle>
                          <CardDescription className="text-blue-600 font-medium">
                            {shelf.documents.length} document{shelf.documents.length !== 1 ? 's' : ''} available
                          </CardDescription>
                        </div>
                      </div>
                      {openShelves.includes(shelf.courseCode) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shelf.documents.map((doc) => (
                        <Card key={doc.id} className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-md transition-shadow duration-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                                  {doc.title}
                                </CardTitle>
                                <CardDescription className="text-blue-600 font-medium">
                                  by {doc.author}
                                </CardDescription>
                              </div>
                              <FileText className="h-6 w-6 text-blue-500 flex-shrink-0 ml-3" />
                            </div>
                          </CardHeader>
                           <CardContent>
                             {/* Cross-course badges */}
                             {doc.courses.length > 1 && (
                               <div className="mb-3">
                                 <div className="flex items-center gap-2 mb-2">
                                   <Link2 className="h-3 w-3 text-blue-500" />
                                   <span className="text-xs text-blue-600 font-medium">Also in:</span>
                                 </div>
                                 <div className="flex flex-wrap gap-1">
                                   {doc.courses
                                     .filter(courseCode => courseCode !== shelf.courseCode)
                                     .map(courseCode => (
                                       <Badge key={courseCode} variant="secondary" className="text-xs">
                                         {courseCode}
                                       </Badge>
                                     ))}
                                 </div>
                               </div>
                             )}
                             
                             <div className="space-y-2 text-sm text-gray-600 mb-4">
                               <div className="flex justify-between">
                                 <span>Pages:</span>
                                 <span className="font-medium">{doc.pages}</span>
                               </div>
                               <div className="flex justify-between">
                                 <span>Size:</span>
                                 <span className="font-medium">{doc.fileSize}</span>
                               </div>
                               <div className="flex justify-between">
                                 <span>Uploaded:</span>
                                 <span className="font-medium">{doc.uploadDate}</span>
                               </div>
                             </div>
                             
                             <div className="flex gap-2 mb-3">
                               <Button 
                                 size="sm" 
                                 className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                               >
                                 <BookOpen className="mr-1 h-3 w-3" />
                                 Study
                               </Button>
                               <Button size="sm" variant="outline" className="border-blue-300">
                                 <FileText className="mr-1 h-3 w-3" />
                                 View
                               </Button>
                             </div>
                             
                             {/* Course linking controls */}
                             <div className="border-t pt-3">
                               <div className="text-xs text-gray-500 mb-2">Link to courses:</div>
                               <div className="flex flex-wrap gap-1">
                                 {courses.map(course => (
                                   <Button
                                     key={course.courseCode}
                                     size="sm"
                                     variant={doc.courses.includes(course.courseCode) ? "default" : "outline"}
                                     className="text-xs h-6 px-2"
                                     onClick={() => toggleDocumentCourse(doc.id, course.courseCode)}
                                     disabled={doc.courses.includes(course.courseCode) && doc.courses.length === 1}
                                   >
                                     {course.courseCode}
                                   </Button>
                                 ))}
                               </div>
                             </div>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        <UploadDocumentModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          onDocumentUploaded={handleDocumentUploaded}
        />
      </div>
    </div>
  );
};

export default Library;
