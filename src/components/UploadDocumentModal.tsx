
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X } from 'lucide-react';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUploaded: (document: any) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onOpenChange,
  onDocumentUploaded,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    courseCode: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title if not already filled
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, "")
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    
    // TODO: Integrate with Supabase Storage for actual file upload
    // For now, simulate upload
    setTimeout(() => {
      const newDocument = {
        title: formData.title,
        author: formData.author,
        courseCode: formData.courseCode,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 300) + 50, // Mock page count
      };
      
      onDocumentUploaded(newDocument);
      setUploading(false);
      onOpenChange(false);
      
      // Reset form
      setFormData({ title: '', author: '', courseCode: '' });
      setSelectedFile(null);
    }, 2000);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <Upload className="mr-3 h-6 w-6 text-blue-600" />
            Upload Document
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Upload your course materials to study them later in the app.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                Select Document
              </Label>
              <div className="mt-1">
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="file"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700 truncate">
                          {selectedFile.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="ml-2 p-1 h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        Choose file (PDF, DOC, DOCX, TXT)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Document Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., ECE 319 - Introduction to Electronic Transmission"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                Author
              </Label>
              <Input
                id="author"
                type="text"
                placeholder="e.g., R.K Bjunder"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="courseCode" className="text-sm font-medium text-gray-700">
                Course Code (Optional)
              </Label>
              <Input
                id="courseCode"
                type="text"
                placeholder="e.g., ECE 319"
                value={formData.courseCode}
                onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                className="mt-1 border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
