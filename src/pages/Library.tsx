
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileText, ChevronDown, ChevronUp, Plus, Link2, Video, ExternalLink, FileIcon, Trash2, Clock, Search, Filter, Calendar, Tag, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import UploadDocumentModal from '@/components/UploadDocumentModal';
import { useStudySessions } from '@/hooks/useStudySessions';

// Enhanced data structure with document types, tags, and resource tracking
const initialDocuments = [
  {
    id: 1,
    title: "DS & A for University Beginners",
    author: "Thomas H. Cormen",
    uploadDate: "2024-06-10",
    fileSize: "3.2 MB",
    pages: 189,
    type: "textbook",
    tags: ["algorithms", "data-structures", "programming", "computer-science"],
    courses: ["ECE 319"],
    resources: [
      {
        id: 1,
        type: "video",
        title: "Data Structures Explained",
        url: "https://youtube.com/watch?v=example1",
        addedAt: "2024-06-15T10:30:00Z"
      },
      {
        id: 2,
        type: "research",
        title: "Big O Notation Research Paper",
        url: "https://arxiv.org/example",
        addedAt: "2024-06-14T15:45:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Advanced Algorithms Handbook",
    author: "Robert Sedgewick",
    uploadDate: "2024-06-08",
    fileSize: "2.8 MB",
    pages: 245,
    type: "handbook",
    tags: ["algorithms", "advanced", "optimization", "graphs"],
    courses: ["ECE 319", "CS 101"],
    resources: [
      {
        id: 3,
        type: "pdf",
        title: "Algorithm Analysis Supplement",
        url: "https://example.com/algo-analysis.pdf",
        addedAt: "2024-06-10T09:20:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Electronic Transmission Fundamentals",
    author: "R.K Bjunder",
    uploadDate: "2024-06-12",
    fileSize: "2.4 MB",
    pages: 245,
    type: "textbook",
    tags: ["electronics", "transmission", "engineering", "signals"],
    courses: ["ECE 320"],
    resources: []
  },
  {
    id: 4,
    title: "Network Protocols Guide",
    author: "A.S Tanenbaum",
    uploadDate: "2024-06-08",
    fileSize: "1.8 MB",
    pages: 156,
    type: "guide",
    tags: ["networking", "protocols", "tcp-ip", "internet"],
    courses: ["CS 101"],
    resources: [
      {
        id: 4,
        type: "video",
        title: "TCP/IP Explained",
        url: "https://youtube.com/watch?v=example2",
        addedAt: "2024-06-12T14:15:00Z"
      }
    ]
  },
  {
    id: 5,
    title: "TCP/IP Protocol Suite",
    author: "Behrouz A. Forouzan",
    uploadDate: "2024-06-05",
    fileSize: "4.1 MB",
    pages: 312,
    type: "reference",
    tags: ["networking", "tcp-ip", "protocols", "communication"],
    courses: ["CS 101", "ECE 320"],
    resources: []
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
  const [showAddResource, setShowAddResource] = useState<number | null>(null);
  const [newResource, setNewResource] = useState({ type: 'video', title: '', url: '' });
  
  // Study session tracking
  const { recordDocumentView, recordResourceAccess } = useStudySessions();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique document types and tags for filters
  const documentTypes = useMemo(() => {
    const types = [...new Set(documents.map(doc => doc.type))];
    return types.sort();
  }, [documents]);

  const allTags = useMemo(() => {
    const tags = [...new Set(documents.flatMap(doc => doc.tags))];
    return tags.sort();
  }, [documents]);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Text search (title, author, tags)
      const searchMatch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const typeMatch = typeFilter === 'all' || doc.type === typeFilter;

      // Date filter
      const docDate = new Date(doc.uploadDate);
      let dateMatch = true;
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateMatch = docDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateMatch = docDate >= monthAgo;
      }

      // Tag filter
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.some(tag => doc.tags.includes(tag));

      return searchMatch && typeMatch && dateMatch && tagMatch;
    });
  }, [documents, searchQuery, typeFilter, dateFilter, selectedTags]);

  // Generate library data from filtered documents and courses
  const libraryData = useMemo(() => {
    return courses.map(course => ({
      ...course,
      documents: filteredDocuments.filter(doc => doc.courses.includes(course.courseCode))
    })).filter(course => course.documents.length > 0); // Only show courses with matching documents
  }, [filteredDocuments, courses]);

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
        courses: [courseCode],
        resources: []
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

  const addResource = (docId: number) => {
    if (!newResource.title || !newResource.url) return;
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const resource = {
          id: Date.now(),
          type: newResource.type,
          title: newResource.title,
          url: newResource.url,
          addedAt: new Date().toISOString()
        };
        return { ...doc, resources: [...doc.resources, resource] };
      }
      return doc;
    }));
    
    setNewResource({ type: 'video', title: '', url: '' });
    setShowAddResource(null);
  };

  const removeResource = (docId: number, resourceId: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, resources: doc.resources.filter(r => r.id !== resourceId) };
      }
      return doc;
    }));
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-3 w-3" />;
      case 'pdf': return <FileIcon className="h-3 w-3" />;
      case 'research': return <ExternalLink className="h-3 w-3" />;
      default: return <ExternalLink className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setDateFilter('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== '' || typeFilter !== 'all' || dateFilter !== 'all' || selectedTags.length > 0;

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

        {/* Search and Filter Section */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4">
            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents, authors, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-blue-50 border-blue-300" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && <Badge className="ml-2 h-4 w-4 rounded-full p-0" />}
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4 border-t pt-4">
                {/* Type and Date Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {documentTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Upload Date
                    </label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tag Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Button
                        key={tag}
                        size="sm"
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">Active Filters:</div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {searchQuery && (
                        <Badge variant="secondary">Search: "{searchQuery}"</Badge>
                      )}
                      {typeFilter !== 'all' && (
                        <Badge variant="secondary">Type: {typeFilter}</Badge>
                      )}
                      {dateFilter !== 'all' && (
                        <Badge variant="secondary">Date: {dateFilter}</Badge>
                      )}
                      {selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary">Tag: {tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
            {libraryData.length === 0 && " (no matches found)"}
          </div>
        )}

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
                             {/* Document type and tags */}
                             <div className="mb-3">
                               <div className="flex items-center gap-2 mb-2">
                                 <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                   {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                                 </Badge>
                               </div>
                               <div className="flex flex-wrap gap-1">
                                 {doc.tags.slice(0, 3).map(tag => (
                                   <Badge key={tag} variant="secondary" className="text-xs">
                                     {tag}
                                   </Badge>
                                 ))}
                                 {doc.tags.length > 3 && (
                                   <Badge variant="secondary" className="text-xs">
                                     +{doc.tags.length - 3} more
                                   </Badge>
                                 )}
                               </div>
                             </div>

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
                                  onClick={() => recordDocumentView(doc.title, doc.id.toString())}
                                >
                                  <BookOpen className="mr-1 h-3 w-3" />
                                  Study
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-300"
                                  onClick={() => recordDocumentView(doc.title, doc.id.toString())}
                                >
                                  <FileText className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                               </div>
                              
                              {/* Resource tracking section */}
                              <div className="border-t pt-3 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-xs text-gray-500">Resources ({doc.resources.length}):</div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => setShowAddResource(showAddResource === doc.id ? null : doc.id)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                                
                                {/* Existing resources */}
                                {doc.resources.length > 0 && (
                                  <div className="space-y-2 mb-3">
                                    {doc.resources.map(resource => (
                                      <div key={resource.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            {getResourceIcon(resource.type)}
                                            <Badge variant="outline" className="text-xs">
                                              {resource.type}
                                            </Badge>
                                          </div>
                                          <div className="text-xs font-medium text-gray-800 truncate">
                                            {resource.title}
                                          </div>
                                          <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock className="h-3 w-3" />
                                            {formatTimestamp(resource.addedAt)}
                                          </div>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                            onClick={() => {
                                              recordResourceAccess(resource.title, resource.type, doc.id.toString());
                                              window.open(resource.url, '_blank');
                                            }}
                                          >
                                            <ExternalLink className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            onClick={() => removeResource(doc.id, resource.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Add resource form */}
                                {showAddResource === doc.id && (
                                  <div className="space-y-2 bg-blue-50 p-3 rounded">
                                    <Select
                                      value={newResource.type}
                                      onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value }))}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video Link</SelectItem>
                                        <SelectItem value="research">Research Link</SelectItem>
                                        <SelectItem value="pdf">PDF Link</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      placeholder="Resource title"
                                      className="h-8"
                                      value={newResource.title}
                                      onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                    <Input
                                      placeholder="Resource URL"
                                      className="h-8"
                                      value={newResource.url}
                                      onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="flex-1 h-7"
                                        onClick={() => addResource(doc.id)}
                                      >
                                        Add Resource
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7"
                                        onClick={() => setShowAddResource(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
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
