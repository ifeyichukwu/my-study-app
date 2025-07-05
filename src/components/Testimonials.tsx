
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, GraduationCap, BookOpen, Users } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "ScholarMi helped me generate targeted quizzes from my anatomy textbooks. My exam scores improved by 25%!",
      icon: GraduationCap,
      rating: 5
    },
    {
      name: "Prof. Martinez",
      role: "History Teacher",
      content: "I upload my lesson plans and ScholarMi creates engaging quizzes for my students. Saves me hours every week.",
      icon: BookOpen,
      rating: 5
    },
    {
      name: "Study Group Alpha",
      role: "Engineering Students",
      content: "We use ScholarMi to create practice tests from our notes. The AI understands complex topics perfectly.",
      icon: Users,
      rating: 5
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <testimonial.icon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic">"{testimonial.content}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Testimonials;
