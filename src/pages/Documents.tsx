
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, BookOpen, Plus } from 'lucide-react';
import UploadDocumentModal from '@/components/UploadDocumentModal';

// Mock data for uploaded documents - replace with Supabase storage later
const mockDocuments = [
  {
    id: 1,
    title: "ECE 319 - Introduction to Electronic Transmission",
    author: "R.K Bjunder",
    uploadDate: "2024-06-10",
    fileSize: "2.4 MB",
    pages: 245,
  },
  {
    id: 2,
    title: "Computer Networks - Network Protocols",
    author: "A.S Tanenbaum",
    uploadDate: "2024-06-08",
    fileSize: "1.8 MB",
    pages: 156,
  },
];

const Documents = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleDocumentUploaded = (newDocument: any) => {
    setDocuments(prev => [...prev, { ...newDocument, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Study Documents
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Upload and manage your course materials for easy studying
          </p>
          
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload New Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow duration-200">
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
                  <FileText className="h-8 w-8 text-blue-500 flex-shrink-0 ml-3" />
                </div>
              </CardHeader>
              <CardContent>
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
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <BookOpen className="mr-1 h-3 w-3" />
                    Study
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-300">
                    <Upload className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </div>
              </CardContent>
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

export default Documents;
